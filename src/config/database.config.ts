import mongoose from "mongoose"

export const connectDatabase = (uri: string) => { 
    mongoose.connect(uri)
        .then(() => { 
            console.log('database connected')
            
        })
    
        .catch(err => {
        console.log(err)
    })
}