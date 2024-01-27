import axios, { AxiosInstance } from 'axios';
import { obtertokenDeAcesso } from './tokenDeAcesso';


const criarInstanciaComToken = async (): Promise<AxiosInstance> => {
  try {
    const tokenDeAcesso = await obtertokenDeAcesso()

    const instancia = axios.create({
      baseURL: 'https://api.assertivasolucoes.com.br/',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${tokenDeAcesso}`,
      },
    });

    return instancia;
  } catch (error) {
    console.error('Erro ao criar instância com token:', error);
    throw error;
  }
};


export default criarInstanciaComToken;




