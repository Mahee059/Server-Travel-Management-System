import multer from "multer";
import fs from 'fs'

export const upload = () => {

  if (!fs.existsSync('uploads')) { 
    fs.mkdirSync('uploads',{recursive:true})
     
   }

  const storage = multer.diskStorage({
    destination:function(req,file,cb){
      cb(null,'uploads/')
    },
    filename:function(req,file,cb){
      const fileName = file.fieldname + '-'  + Date.now()  + '-' + file.originalname
      cb(null,fileName)
    }
  })
  return multer({ storage});
};