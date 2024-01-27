import dotenv from 'dotenv'
dotenv.config({path: '../.env'})
import express from 'express'
import rotas from './rotas'

const app = express()

app.use(rotas)


app.listen(3000)





