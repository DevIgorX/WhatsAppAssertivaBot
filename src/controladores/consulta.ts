import { Request, Response } from 'express'
import criarInstanciaComToken from '../Api/axios'

export const consultar_cpf = async (req: Request, res: Response) => {
    const { cpf } = req.query

    try {

        const instancia = await criarInstanciaComToken()

        const { data } = await instancia.get(`/localize/v3/cpf?cpf=${cpf}&idFinalidade=1`)

        return res.status(200).json(data)

    } catch (error) {
        return res.status(500).json({ mesagem: error })
        throw error
    }
}


export const consultar_endereco = async (req: Request, res: Response) => {
    const { cpf } = req.query

    try {

        const instancia = await criarInstanciaComToken()

        const { data } = await instancia.get(`/localize/v3/cpf?cpf=${cpf}&idFinalidade=1`)

        const { resposta: { dadosCadastrais: { nome } } } = data

        const { complemento, bairro, numero, cidade, uf, cep } = data.resposta.enderecos[0]

        const endereco_completo = { nome_do_cliente: nome, Endereco: complemento, numero, bairro, cidade, uf, cep }

        return res.status(200).json(endereco_completo)


    } catch (error) {
        console.log(error)

        if(error.status === 404){
            return res.status(505).json({mensagem: 'CPF não localizado.'})
        }
        if(error.status === 400){
            return res.status(505).json({mensagem: 'CPF inválido ou inexistente. Verifique as informações e tente novamente.'})
        }

        return res.status(500).json({mensagem:`Erro interno do Servidor: ${error.message}`})
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
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno do Servidor' })
    }

}


//função auxiliar para obter o protocolo de uma consulta inicial de CPF

const ObterProtoco = async (cpf: string): Promise<string | null> => {

    try {
        const instancia = await criarInstanciaComToken()

        const { data } = await instancia.get(`/localize/v3/cpf?cpf=${cpf}&idFinalidade=1`)
        const { cabecalho: { protocolo } } = data
        return protocolo

    } catch (error) {
        console.log('Erro ao obter protocolo', error)
        return null
    }

}



// Função para consulta de contatos relacionados
export const consulta_contatos_relacionado = async (req: Request, res: Response) => {

    const { tipo, documento, cpf } = req.query; // Pega os parâmetros do request

    if (!tipo || !documento || !cpf) {
        return res.status(400).json({ mensagem: 'Paramentros tipo, documento e cpf são obrigatório obrigatórios' })
    }


    try {

        const protocolo = await ObterProtoco(cpf as string)

        if (!protocolo) {
            return res.status(505).json({ mensagem: 'Erro ao Obter protocolo' })
        }

        const instancia = await criarInstanciaComToken();

        // Realiza a consulta com os parâmetros tipo, documento e protocolo
        const { data } = await instancia.get('/localize/v3/mais-telefones', {
            params: {
                tipo,          // CPF ou CNPJ
                documento,     // CPF ou CNPJ fornecido pelo usuário
                protocolo      // Protocolo da consulta anterior
            }
        });


        const { resposta: { maisTelefones: { fixos, moveis } } } = data


        const contatosFixos = fixos.map((fixo: any) => {
            return fixo.numero
        })

        const contatosMoveis = moveis.map((moveis: any) => {
            return moveis.numero
        })

        const todosContatos = [...contatosMoveis, ...contatosFixos]


        return res.status(200).json(todosContatos)


    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensagem: 'Erro interno do Servidor' });
    }
};










