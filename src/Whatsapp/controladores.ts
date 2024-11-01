import criarInstanciaComToken from "../Api/axios";

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




