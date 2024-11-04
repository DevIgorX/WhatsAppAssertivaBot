import criarInstanciaComToken from "../Api/axios";
import { ObterProtoco } from "./funcoesAuxiliares";

export const consulta_telefone = async (cpf) => {
                
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


    return todosContatos


};


//const usuarioEstdo: { [chave: string]: string } = {}

export const consultar_endereco = async (cpf) =>{

    try {

        const instancia = await criarInstanciaComToken()

        const { data } = await instancia.get(`/localize/v3/cpf?cpf=${cpf}&idFinalidade=1`)

        const {resposta: {dadosCadastrais:{nome}}} = data

        const { tipoLogradouro, logradouro, complemento, bairro, numero, cidade, uf , cep} = data.resposta.enderecos[0]


        const endereco_completo = [
           
            { chave: "Nome do cliente: ", valor: nome },
            {chave: "Endereço: ",valor: `${tipoLogradouro} ${logradouro}`},
            { chave: "Complemento: ", valor: complemento },
            { chave: "bairro: ", valor: bairro },
            { chave: "numero: ", valor: numero },
            { chave: "cidade: ", valor: cidade },
            { chave: "uf: ", valor: uf },
            { chave: "cep: ", valor: cep },
        ]


        return endereco_completo

        
    } catch (error) {
        console.log(error)
        return 'Desculpe, não conseguimos processar seu CPF no momento.'
    }


}



// Função para consulta de contatos relacionados
export const contatos_Relacionados = async (cpf: string) => {

    try {

        const paramentrosProtocolo = await ObterProtoco(cpf as string)

        if (!paramentrosProtocolo) {
            return 'Erro ao Obter protocolo' 
        }

        const instancia = await criarInstanciaComToken();

        // Realiza a consulta com os parâmetros tipo, documento e protocolo
        const { data } = await instancia.get('/localize/v3/mais-telefones', {
            params: {
                tipo:paramentrosProtocolo.tipo,       // CPF ou CNPJ
                documento: paramentrosProtocolo.documento, // CPF ou CNPJ fornecido pelo usuário
                protocolo: paramentrosProtocolo.protocolo  // Protocolo da consulta anterior
            }
        });

        if (!data.resposta.maisTelefones) {
            return 'Nenhum telefone relacionado encontrado para o CPF informado.';
        }


        // Extrai os telefones do resultado da API, se existirem
        const { resposta: { maisTelefones: {fixos, moveis} } } = data;

        const contatosFixos  = fixos.map((fixo:any)=>{
            return fixo.numero
        })

        const contatosMoveis = moveis.map((movel:any)=>{
            return movel.numero
        })

        const todosContatos = [...contatosMoveis , ...contatosFixos]
    
        // Retorna os dados dos telefones encontrados

        return todosContatos
        
    } catch (error) {
        console.log(error);
       return 'Infelizmente, não localizamos mais telefones para este CPF. Tente novamente mais tarde.' 
    }
};




