import cloudinary from "../config/cloudinary.config"; 
import CustomError from "../middlewares/error-handler.middleware";
import fs  from 'fs'


export const uploadFile = async (path: string, dir: string = '/') => {
    console.log(dir)
    try {
        const { public_id, secure_url } = await cloudinary.uploader.upload(path, {
            folder: 'travel_managent' + dir,
            allowed_formats: ['gif', 'jpg', 'png', 'webp', 'svg'],
            unique_filename: true
        })
        if (fs.existsSync(path)) {
            fs.unlinkSync(path)

        }

        return {
            public_id,
            path: secure_url
        }


    } catch (error) {
        console.log(error)
        throw new CustomError('file upload error', 500)

    }
};



export const deleteFile = async (public_ids: string[]) => {
    try {
        await Promise.all(public_ids.map(async (public_id: string) => await cloudinary.uploader.destroy(public_id)))
        return true
    
    
    } catch (error) {
        console.log(error);
        throw new CustomError("file delete error", 500);
    }
}
