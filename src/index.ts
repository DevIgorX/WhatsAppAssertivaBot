import dotenv from 'dotenv'
dotenv.config({path: '../.env'})
import express from 'express'
import rotas from './rotas'

import { startBot } from './Whatsapp/bot'


const app = express()

app.use(rotas)

//startBot()

app.listen(3000)





