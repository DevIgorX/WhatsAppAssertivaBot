
import { create } from 'venom-bot'
import { consulta_telefone } from './controladores';


export const startBot = () => {
    create({ session: 'Whataspp-bot' }).then((client) => {
        start(client)

    }).catch((erro: any) => {
        console.log(erro)
    });
}


// Objeto para armazenar o estado atual de cada usuário //objeto com chave-valor

const usuarioEstdo: {[chave: string]: string}= {}

function start(client: any) {
    client.onMessage((message: any) => {
        // Verifica se a mensagem não está vazia e não é de um grupo
        if (message.body != "" && message.isGroupMsg === false) {
            
            //pega o estado atual do usuario, se existir

            const estadoAtual = usuarioEstdo[message.from] || 'inicial'


            if(estadoAtual === 'inicial'){
                //Estado inicial: Pergunta comoo usuário quer ser ajudado
                client.sendText(message.from, `Olá, como posso te ajudar hoje?\n 1 - Mais contatos? \n 2 - Endereços`);
                //atualiza o estado do usuario

                usuarioEstdo[message.from] = 'aguardando_opção'
            }else if(estadoAtual === 'aguardando_opção'){
                //bot está aguardando uma resposta da primeira pergunta 
                if(message.body === '1'){
                    client.sendText(message.from,'Por favor digite o seu CPF')
                    //Atualiza o estado para aguardando o CPF
                    usuarioEstdo[message.from] =  'aguardando_cpf'
                }else if(message.body === '2'){
                    client.sendText(message.from, 'Segue endereço: \n Rua 3, Setor São josé')
                    //volta o estado para inicial depois de completar a ação
                    usuarioEstdo[message.from] = 'inicial'
                }else {
                    //se o usuário não digitar uma opção válida
                    client.sendText('Por favor ,escolha uma opção válida: 1 ou 2')
                }
            }else if(estadoAtual === 'aguardando_cpf'){

                consulta_telefone(message.body).then((contatos)=>{
                     const contatosFormatados = contatos.join('\n'); // formata a lista de contatos em multiplas linhas
                     client.sendText(message.from, `Segue contatos:\n${contatosFormatados}`)
                     //volta ao estado para inicial 
                     usuarioEstdo[message.from] = 'inicial'
                }).catch((erro)=>{
                    console.log('Erro ao consultar o telefone:', erro)
                    client.sendText(message.from, 'Desculpe, não conseguimos processar seu CPF no momento.')
                    usuarioEstdo[message.from] = 'inicial'
                })

            }


           
        }
    });
}







