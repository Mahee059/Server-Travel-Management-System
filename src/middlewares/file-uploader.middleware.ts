import multer from "multer";

export const upload = () => {
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