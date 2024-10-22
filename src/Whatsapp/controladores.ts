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