import { Request, Response } from 'express'
import criarInstanciaComToken from '../Api/axios'

export const consultar_cpf = async (req: Request, res: Response) => {
    const { cpf } = req.query

    try {

        const instancia = await criarInstanciaComToken()

        const { data } = await instancia.get(`/localize/v3/cpf?cpf=${cpf}&idFinalidade=1`)

        // const {resposta:{telefonesAdicionados:{moveis}} } = data

        return res.status(200).json(data)


    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
        throw error
    }
}


export const consulta_telefone = async (req: Request, res: Response) => {
    const { cpf } = req.query

    try {

        const instancia = await criarInstanciaComToken()

        const { data } = await instancia.get(`/localize/v3/cpf?cpf=${cpf}&idFinalidade=1`)

        const { resposta: { telefones: { moveis, fixos } } } = data


        const contatosMoveis = moveis.map((movel: any) => {
            return movel.numero
        })

        const contatosFixos = fixos.map((movel: any) => {
            return movel.numero
        })


        const todosContatos = [...contatosMoveis, ...contatosFixos]


        return res.status(200).json(todosContatos)


    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do Servidor' })
    }

}


export const consulta_telefonesRelacionados = async (req: Request, res: Response) => {
    const { cpf } = req.query

    try {

        const instancia = await criarInstanciaComToken()

        const { data } = await instancia.get(`/localize/v3/mais-telefones`)


        return res.status(200).json(data)


    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do Servidor' })
    }

}








