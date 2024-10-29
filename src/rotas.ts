
import {Router} from 'express'
import { consultar_cpf, consultar_endereco, consulta_telefone } from './controladores/consulta'

const rotas = Router()
rotas.get('/assertiva', consultar_cpf)
rotas.get('/assertiva/contatos', consulta_telefone)
rotas.get('/assertiva/enderecos', consultar_endereco)








export default rotas 

