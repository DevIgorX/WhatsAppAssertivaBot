
import { create } from 'venom-bot'
import { consultar_endereco, consultar_localizacao, consulta_telefone, contatos_Relacionados } from './controladores';


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

// Objeto para armazenar os temporizadores de cada usuário/ guarda um objeto do tipo NodeJs.Timeout
const usuarioTimers: { [chave: string]: NodeJS.Timeout | number } = {};

function start(client: any) {
    let cpf_consulta: string

    client.onMessage(async (message: any) => {
        // Verifica se a mensagem não está vazia e não é de um grupo
        if (message.body != "" && message.isGroupMsg === false) {

            const UsuarioId = message.from
            //pega o estado atual do usuario, se existir

            const estadoAtual = usuarioEstdo[message.from] || 'inicial'

            // Função para redefinir o temporizador de inatividade
            const resetTimer = () => {
                if (usuarioTimers[UsuarioId]) clearTimeout(usuarioTimers[UsuarioId]); //if na sintaxe abreviada

                usuarioTimers[UsuarioId] = setTimeout(() => {
                    usuarioEstdo[UsuarioId] = "inicial";
                    client.sendText(
                        UsuarioId,
                        "🚶‍♂️ Você ficou inativo por muito tempo. O atendimento foi encerrado. Se precisar de ajuda, é só enviar uma nova mensagem!"
                    );
                }, 180000); // 3 minutos
            };

            resetTimer(); // Reinicia o temporizador sempre que uma mensagem é recebida

            if (estadoAtual === 'inicial') {
                //Estado inicial: Pergunta comoo usuário quer ser ajudado
                await client.sendText(message.from, `Olá, ${message.notifyName}! 🚛💨\n\nBem-vindo ao assistente virtual da Domicílio Transportes! Agora ficou ainda mais fácil agilizar suas entregas. ✅ \n\nDigite o *CPF do cliente* que deseja consultar, e eu retornarei todas as informações necessárias: \n📞 contatos e 🏠 endereço. Vamos começar? 😊`);

                await client.sendText(message.from, 'Por favor, digite o CPF do(a) cliente')
                //atualiza o estado do usuario

                usuarioEstdo[message.from] = 'aguardando_cpf_contatos'

            } else if (estadoAtual === 'aguardando_cpf_contatos') {
                // Remove caracteres não numéricos do CPF
                const cpf_do_cliente = message.body.replace(/\D/g, '');
                //expressão regular para validar o CPF
                if (!/^\d{11}$/.test(cpf_do_cliente)) {
                    await client.sendText(message.from, 'CPF inválido. Por favor, insira um CPF válido com 11 dígitos.');
                    return; // Sai da função para que o usuário possa tentar novamente
                }

                cpf_consulta = message.body


                try {


                    const contatos = await consulta_telefone(message.body)
                    const localizacao = await consultar_localizacao(message.body)
                    const enderecos = await consultar_endereco(message.body)


                    if (typeof contatos === 'string' || typeof enderecos === 'string') {
                        await client.sendText(message.from, contatos)
                        if (contatos.includes("Oops!")) {
                            return
                        }
                        await client.sendText(message.from, '*1*. Tentar novamente?\n*2*. Não, talvez mais tarde!')
                        usuarioEstdo[message.from] = 'aguardando_tente_Novamente_contato'
                        return;

                    } else {
                        const contatosFormatados = contatos.join('\n\n') //retorna uma string unica usando uma nova linha como separador dos contatos

                        await client.sendText(message.from, `Segue contatos:\n${contatosFormatados}\n`)

                        const enderecoFormatado = enderecos.map(item => `${item.chave} ${item.valor}`).join('\n')
                        await client.sendText(message.from, `Segue Endereço:\n${enderecoFormatado}`)

                        const descricao = `Endereço: ${localizacao.tipoLogradouro} ${localizacao.logradouro}, ${localizacao.bairro}, ${localizacao.cidade} - ${localizacao.uf}`
                        await client.sendLocation(message.from, localizacao.latitude, localizacao.longitude, descricao)
                    }


                } catch (error) {
                    console.log('Erro ao consultar o telefone:', error.message)

                    if (!error.message) {
                        await client.sendText(message.from, `Deseja tentar mais telefones de referências ou empresas relacionadas? \n *1* - Sim\n *2* - Não`)
                        usuarioEstdo[message.from] = 'aguardando_relacionados'
                        return
                    }

                    client.sendText(message.from, 'Nenhum dado foi encontrado para esse CPF. Verifique as informações e tente novamente mais tarde.')
                    usuarioEstdo[message.from] = 'inicial'
                }


            } else if (estadoAtual === 'aguardando_relacionados') {
                if (message.body === '1') {

                    const contatosRelacionados = await contatos_Relacionados(cpf_consulta)

                    if (typeof contatosRelacionados === 'string') {
                        await client.sendText(message.from, contatosRelacionados)
                        usuarioEstdo[message.from] = 'inicial'
                        return;

                    } else {

                        const contatosRelacionadosFormatados = contatosRelacionados.join('\n\n')

                        await client.sendText(message.from, `Segue mais contatos:\n${contatosRelacionadosFormatados}\n`)

                    }

                    await client.sendText(message.from, '👍 Espero que esses contatos ajudem! Se precisar de mais suporte, é só chamar. Até logo! 😊');

                    usuarioEstdo[message.from] = 'inicial'


                } else if (message.body === '2') {
                    await client.sendText(message.from, '👍 Tudo certo! Vamos encerrar o atendimento por aqui. Se precisar de mais ajuda, é só mandar uma mensagem. Até logo! 😊')
                    usuarioEstdo[message.from] = 'inicial'
                } else {
                    await client.sendText(message.from, 'Por favor, escolha uma opção válida: 1 ou 2')
                }

            } else if (estadoAtual === 'aguardando_tente_Novamente_contato') {
                if (message.body === '1') {
                    await client.sendText(message.from, 'Por favor digite o CPF do(a) cliente')
                    usuarioEstdo[message.from] = 'aguardando_cpf_contatos'
                } else if (message.body === '2') {
                    await client.sendText(message.from, 'Tudo bem, vamos encerrar o seu atendimento por aqui. Se precisar de mais ajuda, é só chama! 😌🚚')
                    usuarioEstdo[message.from] = 'inicial'
                } else {
                    await client.sendText(message.from, 'Por favor, escolha uma opção válida: 1 ou 2')
                }
            }


        }
    }
    );

    //fecha a sessão ao encerrar
    process.on("SIGINT", async () => {
        console.log("Encerrando bot... Fechando sessão.");
        await client.close();
        console.log("Sessão encerrada.");
        process.exit();
    });


}







