
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
                await client.sendText(message.from, `Olá ${message.notifyName}! 🚛💨\n\nSeja bem-vindo ao assistente virtual da Domicilio Transportes! Estou aqui para facilitar suas entregas, fornecendo informações essenciais sobre os clientes de forma rápida e prática.\n\nComo posso te ajudar hoje?  \n\n📞*1* - Consultar contatos dos clientes?  \n🏠*2* - Obter informações de endereços?  \n\nBasta responder com o número da opção desejada e vamos otimizar suas entregas!`);

                //atualiza o estado do usuario

                usuarioEstdo[message.from] = 'aguardando_opção'
            } else if (estadoAtual === 'aguardando_opção') {
                //bot está aguardando uma resposta da primeira pergunta 
                if (message.body === '1') {
                    await client.sendText(message.from, 'Por favor digite o CPF do(a) cliente')
                    //Atualiza o estado para aguardando o CPF
                    usuarioEstdo[message.from] = 'aguardando_cpf_contatos'
                } else if (message.body === '2') {
                    await client.sendText(message.from, 'Por favor digite o CPF do(a) cliente')
                    usuarioEstdo[message.from] = 'aguardando_cpf_endereco'

                } else {
                    //se o usuário não digitar uma opção válida
                    await client.sendText(message.from, 'Por favor ,escolha uma opção válida: 1 ou 2')
                }
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

                    if (typeof contatos === 'string') {
                        await client.sendText(message.from, contatos)
                        await client.sendText(message.from, '*1*. Tentar novamente?\n*2*. Não, talvez mais tarde!')
                        usuarioEstdo[message.from] = 'aguardando_tente_Novamente_contato'
                        return;

                    } else {
                        const contatosFormatados = contatos.join('\n\n') //retorna uma string unica usando uma nova linha como separador dos contatos

                        await client.sendText(message.from, `Segue contatos:\n${contatosFormatados}\n`)
                    }

                    await client.sendText(message.from, `Não conseguiu contato com esses números? Deseja tentar mais telefones de referências ou empresas relacionadas? \n *1* - Sim\n *2* - Não`)

                    //colocar tempo de espera
                    usuarioEstdo[message.from] = 'aguardando_relacionados'

                } catch (error) {
                    console.log('Erro ao consultar o telefone:', error.message)
                    client.sendText(message.from, 'Nenhum dado foi encontrado para esse CPF. Verifique as informações e tente novamente mais tarde.')
                    usuarioEstdo[message.from] = 'inicial'
                }

            } else if (estadoAtual === 'aguardando_cpf_endereco') {

                const cpf = message.body.replace(/\D/g, '')

                if (!/^\d{11}$/.test(cpf)) {
                    await client.sendText(message.from, 'CPF inválido. Por favor, insira um CPF válido com 11 dígitos.');
                    return; // Sai da função para que o usuário possa tentar novamente
                }


                try {
                    const enderecos = await consultar_endereco(message.body)
                    const localizacao = await consultar_localizacao(message.body)
                    //verifica se o retorno é uma string de erro
                    if (typeof enderecos === 'string') {
                        await client.sendText(message.from, enderecos)
                        await client.sendText(message.from, '*1*. Tentar novamente?\n*2*. Não, talvez mais tarde!')
                        usuarioEstdo[message.from] = 'aguardando_tente_Novamente_endereco'
                        return
                    } else {
                        //formata o endereço em uma string legível para o usuario

                        const enderecoFormatado = enderecos.map(item => `${item.chave} ${item.valor}`).join('\n')
                        await client.sendText(message.from, `Segue Endereço:\n${enderecoFormatado}`)


                        const descricao = `Endereço: ${localizacao.tipoLogradouro} ${localizacao.logradouro}, ${localizacao.bairro}, ${localizacao.cidade} - ${localizacao.uf}`
                        await client.sendLocation(message.from, localizacao.latitude, localizacao.longitude, descricao)

                    }

                    await client.sendText(message.from, '📞 Espero que esse endereço te ajude! Se precisar de mais suporte, estarei por aqui. Até mais! 💬');

                    usuarioEstdo[message.from] = 'inicial'


                } catch (error) {
                    console.log('Erro ao consultar o telefone:', error.message)
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



            } else if (estadoAtual === 'aguardando_tente_Novamente_endereco') {
                if (message.body === '1') {
                    await client.sendText(message.from, 'Por favor digite o CPF do(a) cliente')
                    usuarioEstdo[message.from] = 'aguardando_cpf_endereco'
                } else if (message.body === '2') {
                    await client.sendText(message.from, 'Ok, vamos encerrar o seu atendimento por aqui. Se precisar de mais ajuda, é só chama! 😌🚛')
                    usuarioEstdo[message.from] = 'inicial'
                } else {
                    await client.sendText(message.from, 'Por favor ,escolha uma opção válida: 1 ou 2')
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
}







