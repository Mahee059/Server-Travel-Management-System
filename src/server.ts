import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { connectDatabase } from './config/database.config'
import CustomError, { errorHandler } from './middlewares/error-handler.middleware'


//importing routes
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import PackageRoutes from './routes/tour_package.routes'
import bookingRoutes from'./routes/booking.routes'
import helmet from 'helmet'

const PORT = process.env.PORT || 8080

const DB_URI = process.env.DB_URI?? ''

  
const app = express()


//using middleswares
app.use(cors())
app.use(helmet())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '5mb' }))
//cors
//headers
//...
 

// serving static. files 
app.use("/api/uploads", express.static("uploads/"));

//connect database 
connectDatabase(DB_URI)

//ping route 


app.get('/', (req, res) => { 
    res.status(200).json({ 
        message:'server is up & running '
    }) 
      
})
  
//using routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/tour_package', PackageRoutes);

 
//fallback route
app.all('/{*a}', (req: Request, res: Response, next: NextFunction) => {
    const error: any = new CustomError(`can not ${req.method} on ${req.originalUrl}` , 404)
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
