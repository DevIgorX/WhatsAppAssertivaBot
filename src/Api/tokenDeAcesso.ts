import axios from "axios"
import dotenv from 'dotenv'
dotenv.config()



export const obtertokenDeAcesso = async ():Promise<string> => {
    try {
        const response = await axios.post('https://api.assertivasolucoes.com.br/oauth2/v3/token',
             //2 argumento especifica os dados que a API deve processar- identificação do tipo de fluxo, ou seja, fluxo de credenciais do cliente
            {
                grant_type: 'client_credentials',
            },
            //3 argumento objeto de configuração, cabeçalho e autenticação
            {
                auth: {
                    username:process.env.CLIENT_ID,
                    password:process.env.CLIENTE_SECRET
                },

                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                  },

            } 
               
        )

        const tokenDeAcesso = response.data.access_token

        return tokenDeAcesso

    } catch (error) {
        
        console.error('Erro ao obter token de acesso:' )
        throw error
    }
}


