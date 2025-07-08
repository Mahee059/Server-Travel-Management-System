import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import { connectDatabase } from './config/database.config'
import { errorHandler } from './middlewares/error-handler.middleware'

//importing routes
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'

const PORT = process.env.PORT || 8080

const DB_URI = process.env.DB_URI?? ''

  
const app = express()


//using middleswares
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '5mb' }))
//cors
//headers
//...

//connect database 
connectDatabase(DB_URI)

//ping route 


app.get('/', (req, res) => { 
    res.status(200).json({ 
        message:'server is up & running '
    }) 
      
})
  
//using routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)

 
//fallback route
app.all('/{*a}',(req: Request, res: Response, next: NextFunction) => {
    const error: any = new Error('can not ${req.method} on $ {req.originalUrl')
error.statusCode = 404
    error.status = 'fail'
    error.success = false 
    next (error)
    
})



app.listen(PORT,() => { 
    console.log (`server running at http://localhost:${PORT}`)
})
    
//error handler middelware
//use server.ts
//customError handler class and use
//using error Handler

app.use(errorHandler)