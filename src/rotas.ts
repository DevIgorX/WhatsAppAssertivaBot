
import {Router} from 'express'
import { consultar_cpf, consultar_endereco, consulta_contatos_relacionado, consulta_telefone } from './controladores/consulta'

const rotas = Router()
rotas.get('/assertiva', consultar_cpf)
rotas.get('/assertiva/contatos', consulta_telefone)
rotas.get('/assertiva/enderecos', consultar_endereco)
rotas.get('/assertiva/consultar_Relacionados', consulta_contatos_relacionado)








export default rotas 

