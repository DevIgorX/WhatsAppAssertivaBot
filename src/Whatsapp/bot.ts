
import { create, Whatsapp } from 'venom-bot'


export const startBot = () => {
    create({ session: 'Whataspp-bot' }).then((client) => {
        start(client)

    }).catch((erro: any) => {
        console.log(erro)
    });
}


// Objeto para armazenar o estado atual de cada usuário //objeto com chave-valor
const userState: { [key: string]: string } = {};

function start(client: any) {
    client.onMessage((message: any) => {
        // Verifica se a mensagem não está vazia e não é de um grupo
        if (message.body != "" && message.isGroupMsg === false) {
            
            // Pega o estado atual do usuário, se existir
            const currentState = userState[message.from] || 'inicial'; //se caso o valor dentro de userState for underfined será atribuido 'initial'

            if (currentState === 'inicial') {
                // Estado inicial: Pergunta como o usuário quer ser ajudado
                client.sendText(message.from, `Olá, como posso te ajudar hoje?\n 1 - Mais contatos? \n 2 - Endereços`);
                // Atualiza o estado do usuário
                userState[message.from] = 'awaiting_option';
            } 
            else if (currentState === 'awaiting_option') {
                // O bot está aguardando uma resposta da primeira pergunta
                if (message.body === '1') {
                    client.sendText(message.from, 'Por favor, digite o CPF:');
                    // Atualiza o estado para esperar o CPF
                    userState[message.from] = 'awaiting_cpf';
                } else if (message.body === '2') {
                    client.sendText(message.from, 'Segue Endereço: Rua 3, Setor São José');
                    // Volta o estado para 'inicial' depois de completar a ação
                    userState[message.from] = 'inicial';
                } else {
                    // Se o usuário não digitou uma opção válida
                    client.sendText(message.from, 'Por favor, escolha uma opção válida: 1 ou 2.');
                }
            } 
            else if (currentState === 'awaiting_cpf') {
                // O bot está aguardando o CPF
                client.sendText(message.from, `CPF recebido: ${message.body}`);
                // Aqui você pode processar o CPF e fazer o que for necessário com ele
                console.log(`CPF do usuário: ${message.body}`);

                // Depois de capturar o CPF, volte o estado para 'initial'
                userState[message.from] = 'inicial';
            }
        }
    });
}







