import e from "express";
import criarInstanciaComToken from "../Api/axios";
import { ObterProtoco } from "./funcoesAuxiliares";
import { EndereoItem } from "./tiposUtilitarios";


export const consulta_telefone = async (cpf: string): Promise<string[] | string> => {

    try {
        const instancia = await criarInstanciaComToken()

        const { data } = await instancia.get(`/localize/v3/cpf?cpf=${cpf}&idFinalidade=1`)


        const { resposta: { telefones: { moveis, fixos } } } = data

        //transforma cada item do array em outro array contendo o resultado dessa transformação
        const contatosMoveis = moveis.map((movel: any) => {
            return movel.numero
        })

        const contatosFixos = fixos.map((movel: any) => {
            return movel.numero
        })


        const todosContatos = [...contatosMoveis, ...contatosFixos]
        //verificação para saber se o array não veio vazio
        if (!todosContatos.length) {
            const buscarRelacionados = await contatos_Relacionados(cpf)
            return buscarRelacionados
        }


        return todosContatos


    } catch (error) {
        console.log(error)

        if (error.status === 404) {
            return 'Nenhum dado foi encontrado para esse CPF. Verifique as informações e tente novamente.'
        } else if (error.status === 400) {
            return 'CPF inválido ou inexistente. Verifique as informações e tente novamente.'
        } else if(error.status === 403){
            return "⏰ Oops! As consultas estão disponíveis após as 08:00 horas. Por favor, volte dentro do horário permitido. 😊"
        } else {
                return 'Desculpe, não conseguimos processar o CPF no momento. Tente novamente mais tarde.'
            }
        
    }


};


export const consultar_endereco = async (cpf: string): Promise<string | EndereoItem[]> => {

    try {

        const instancia = await criarInstanciaComToken()

        const { data } = await instancia.get(`/localize/v3/cpf?cpf=${cpf}&idFinalidade=1`)

        const { resposta: { dadosCadastrais: { nome } } } = data

        const { tipoLogradouro, logradouro, complemento, bairro, numero, cidade, uf, cep } = data.resposta.enderecos[0]


        const endereco_completo: EndereoItem[] = [

            { chave: "Nome do cliente: ", valor: nome },
            { chave: "Endereço: ", valor: `${tipoLogradouro} ${logradouro}` },
            { chave: "Complemento: ", valor: complemento },
            { chave: "bairro: ", valor: bairro },
            { chave: "numero: ", valor: numero },
            { chave: "cidade: ", valor: cidade },
            { chave: "uf: ", valor: uf },
            { chave: "cep: ", valor: cep },
        ]


        if (endereco_completo.length === 0) {
            return 'Nenhum dado foi encontrado para esse CPF. Verifique as informações e tente novamente.'
        }


        return endereco_completo


    } catch (error) {
        console.log(error)

        if (error.status === 404) {
            return 'CPF não localizado no sistema.'
        } else if (error.status === 400) {
            return 'CPF inválido ou inexistente. Verifique as informações e tente novamente.'
        } else {
            return 'Desculpe, não conseguimos processar o CPF no momento. Tente novamente mais tarde.'
        }

    }


}

export const consultar_localizacao = async (cpf)=>{
    const instancia = await criarInstanciaComToken()

    const {data} = await instancia.get(`/localize/v3/cpf?cpf=${cpf}&idFinalidade=1`)

    const {tipoLogradouro, logradouro,latitude, bairro, longitude, cidade, uf} = data.resposta.enderecos[0]

    const dados_localizacao = {tipoLogradouro, logradouro, bairro, latitude, longitude, cidade, uf}

    return dados_localizacao
}


export const contatos_Relacionados = async (cpf: string): Promise<string | string[]> => {

    try {

        const paramentrosProtocolo = await ObterProtoco(cpf)

        if (!paramentrosProtocolo) {
            return 'Erro ao Obter protocolo'
        }

        const instancia = await criarInstanciaComToken();

        // Realiza a consulta com os parâmetros de query, tipo, documento e protocolo
        const { data } = await instancia.get('/localize/v3/mais-telefones', {
            params: {
                tipo: paramentrosProtocolo.tipo,       // CPF ou CNPJ
                documento: paramentrosProtocolo.documento, // CPF ou CNPJ fornecido pelo usuário
                protocolo: paramentrosProtocolo.protocolo  // Protocolo da consulta anterior
            }
        });

        if (!data.resposta.maisTelefones) {
            return 'Nenhum telefone relacionado encontrado para o CPF informado.';
        }

        const { resposta: { maisTelefones: { fixos, moveis } } } = data;

        const contatosFixos = fixos.map((fixo: any) => {
            return fixo.numero
        })

        const contatosMoveis = moveis.map((movel: any) => {
            return movel.numero
        })

        const todosContatos = [...contatosMoveis, ...contatosFixos]

        //verificando se o araray não é um falsy
        if (!todosContatos.length) {
            return 'Infelizmente, não localizamos mais telefones para este CPF. Tente novamente mais tarde.'
        }

        return todosContatos

    } catch (error) {
        console.log(error);
        return 'Infelizmente, não localizamos mais telefones para este CPF. Tente novamente mais tarde.'
    }
};




