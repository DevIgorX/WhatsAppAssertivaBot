import {Request , Response} from 'express'
import criarInstanciaComToken from '../axios'




export const consultar_cpf = async (req: Request, res: Response)=>{
    const {cpf, idFinalidade} = req.query

    try {

        const instancia = await criarInstanciaComToken()
        
        const usuario = await instancia.get(`/localize/v3/cpf?cpf=${cpf}&idFinalidade=${idFinalidade}`)

        const informacao = usuario.data

        return res.status(200).json(informacao)

    } catch (error) {
        console.error('Erro durante a consulta:', error)
        return res.status(500).json({mensagem: 'Erro interno do servidor'})
        throw error
    }
}








