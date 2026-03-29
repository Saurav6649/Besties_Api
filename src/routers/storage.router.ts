import express from 'express'
import { downloadFile, uploadFile } from '../controllers/storage.controllers'

const storageRouter = express.Router()

storageRouter.post('/download',downloadFile)
storageRouter.post('/upload',uploadFile)

export default storageRouter