import criarInstanciaComToken from "../Api/axios";

export const consulta_telefone = async (cpf) => {
                
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


    return todosContatos


};


//const usuarioEstdo: { [chave: string]: string } = {}

export const consultar_endereco = async (cpf) =>{

    try {

        const instancia = await criarInstanciaComToken()

        const { data } = await instancia.get(`/localize/v3/cpf?cpf=${cpf}&idFinalidade=1`)

        const {resposta: {dadosCadastrais:{nome}}} = data

        const { complemento, bairro, numero, cidade, uf , cep} = data.resposta.enderecos[0]


        const endereco_completo = [
            { chave: "Nome do cliente:", valor: nome },
            { chave: "Endereço: ", valor: complemento },
            { chave: "bairro: ", valor: bairro },
            { chave: "numero: ", valor: numero },
            { chave: "cidade: ", valor: cidade },
            { chave: "uf: ", valor: uf },
            { chave: "cep: ", valor: cep },
        ]


        return endereco_completo

        
    } catch (error) {
        console.log(error)
        return 'Erro interno do servidor'
    }


}