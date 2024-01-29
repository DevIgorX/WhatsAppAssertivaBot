import {Router} from 'express'
import { consultar_cpf, consulta_telefone } from './controladores/consulta'

const rotas = Router()
rotas.get('/assertiva', consultar_cpf)
rotas.get('/assertiva/contatos', consulta_telefone)







export default rotas 

