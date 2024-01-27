import axios from "axios"
import dotenv from 'dotenv'
dotenv.config()



export const obtertokenDeAcesso = async () => {
    try {
        const response = await axios.post('https://api.assertivasolucoes.com.br/oauth2/v3/token',
            {
                grant_type: 'client_credentials',
            },

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

// (async () => {
//     try {
//       const token = await obtertokenDeAcesso();
//       console.log(token);
//     } catch (error) {
//       console.error('Erro ao obter token de acesso: 500');
//     }
//   })();

