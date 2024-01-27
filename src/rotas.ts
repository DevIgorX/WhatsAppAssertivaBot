import {Router} from 'express'
import { consultar_cpf } from './controladores/consulta'

const rotas = Router()
rotas.get('/assertiva', consultar_cpf)







export default rotas 

