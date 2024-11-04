import criarInstanciaComToken from "../Api/axios"


export const ObterProtoco = async (cpf_cliente: string): Promise<{tipo:string, documento: string, protocolo:string} | null> => {

    try {
        const instancia = await criarInstanciaComToken()

        const { data } = await instancia.get(`/localize/v3/cpf?cpf=${cpf_cliente}&idFinalidade=1`)
        const { cabecalho: { protocolo, funcionalidade, entrada:{cpf}} } = data

        const dadosAuxiliares= {tipo: funcionalidade, documento: cpf, protocolo}

        return dadosAuxiliares


    } catch (error) {
        console.log('Erro ao obter protocolo', error)
        return null
    }

}