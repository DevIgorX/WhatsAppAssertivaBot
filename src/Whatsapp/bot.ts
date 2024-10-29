
import { create } from 'venom-bot'
import { consultar_endereco, consulta_telefone } from './controladores';


export const startBot = async () => {
    try {

        const client = await create({ session: 'Whatsapp-bot' })

        start(client)

    } catch (error) {
        console.log(error)
    }
}

// Objeto para armazenar o estado atual de cada usuário //objeto com chave-valor

const usuarioEstdo: { [chave: string]: string } = {}

function start(client: any) {
    client.onMessage(async (message: any) => {
        // Verifica se a mensagem não está vazia e não é de um grupo
        if (message.body != "" && message.isGroupMsg === false) {

            //pega o estado atual do usuario, se existir

            const estadoAtual = usuarioEstdo[message.from] || 'inicial'

            if (estadoAtual === 'inicial') {
                //Estado inicial: Pergunta comoo usuário quer ser ajudado
                await client.sendText(message.from, `Olá, ${message.notifyName}, como posso te ajudar hoje?\n 1 - Mais contatos? \n 2 - Endereços`);
                //atualiza o estado do usuario

                usuarioEstdo[message.from] = 'aguardando_opção'
            } else if (estadoAtual === 'aguardando_opção') {
                //bot está aguardando uma resposta da primeira pergunta 
                if (message.body === '1') {
                    await client.sendText(message.from, 'Por favor digite o seu CPF')
                    //Atualiza o estado para aguardando o CPF
                    usuarioEstdo[message.from] = 'aguardando_cpf_contatos'
                } else if (message.body === '2') {
                    await client.sendText(message.from, 'Por favor digite o seu CPF')
                    usuarioEstdo[message.from] = 'aguardando_cpf_endereco'

                } else {
                    //se o usuário não digitar uma opção válida
                    await client.sendText('Por favor ,escolha uma opção válida: 1 ou 2')
                }
            } else if (estadoAtual === 'aguardando_cpf_contatos') {

                try {

                    const contatos = await consulta_telefone(message.body)

                    const contatosFormatados = contatos.join('\n') //retorna uma string unica usando uma nova linha como separador dos contatos

                    await client.sendText(message.from, `Segue contatos:\n${contatosFormatados}`)
                    usuarioEstdo[message.from] = 'inicial'

                } catch (error) {
                    console.log('Erro ao consultar o telefone:', error)
                    client.sendText(message.from, 'Desculpe, não conseguimos processar seu CPF no momento.')
                    usuarioEstdo[message.from] = 'inicial'
                }
            } else if (estadoAtual === 'aguardando_cpf_endereco') {

                try {

                    const enderecos = await consultar_endereco(message.body)
                    //verifica se o retorno é uma string de erro
                    if (typeof enderecos === 'string') {
                        await client.sendText(message.from, enderecos)
                    } else {
                        //formata o endereço em uma string legível para o usuario

                        const enderecoFormatado = enderecos.join('\n')


                        await client.sendText(message.from, `Segue Endereço:\n${enderecoFormatado}`)

                    }

                    usuarioEstdo[message.from] = 'inicial'


                } catch (error) {
                    console.log('Erro ao consultar o telefone:', error)
                    client.sendText(message.from, 'Desculpe, não conseguimos processar seu CPF no momento.')
                    usuarioEstdo[message.from] = 'inicial'
                }

            }



        }
    });
}







