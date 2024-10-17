 
import {create, Whatsapp} from 'venom-bot'


 export const startBot = () =>{
    create({
        session: 'Whataspp-bot'
     }).then((client)=>{
        start(client)
     }).catch((erro:any) =>{
        console.log(erro)
     });
 }


 
function start(client:any){
    client.onMessage((message:any)=>{
        if(message.body === 'Oi'){
            client.sendText(message.from, 'Olá! como posso ajudar?')
        }
    })
}


 