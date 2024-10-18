 
import {create, Whatsapp} from 'venom-bot'


 export const startBot = () =>{
    create({session: 'Whataspp-bot'}).then((client)=>{
        start(client)
        
     }).catch((erro:any) =>{
        console.log(erro)
     });
 }


 
function start(client:any){
    client.onMessage((message:any)=>{
        if(message.body != "" && message.isGroupMsg === false){
           client.sendText(message.from, `Olá como posso te ajudar hoje?\n1 1 - Mais contatos? \n2 2- Endereços`)
           if(message.body === '1'){
            client.sendText(message.from, 'Segue contato: \n1 62992626968')
           }else if(message.body === '2'){
            client.sendText(message.from, 'Segue Endereço: \n1 Rua 3, Setor São José')
           }

           
        }

       
    });
}


 