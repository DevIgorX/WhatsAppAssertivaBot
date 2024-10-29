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


export const consultar_endereco = async (req: Request, res: Response) =>{
    const {cpf} = req.query

    try {

        const instancia = await criarInstanciaComToken()

        const { data } = await instancia.get(`/localize/v3/cpf?cpf=${cpf}&idFinalidade=1`)

        const {resposta: {dadosCadastrais:{nome}}} = data

        const { complemento, bairro, numero, cidade, uf , cep} = data.resposta.enderecos[0]

        const endereco_completo = {nome_do_cliente:nome, Endereco: complemento, numero, bairro , cidade , uf, cep}

        return res.status(200).json(endereco_completo)

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({mensagem: 'Erro interno do servidor'})
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













