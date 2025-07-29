import express from "express";
import {
  create,
  getAll,
  getbyId,
  remove,
  update,
} from "../controllers/tour_package.controllers";
import { authenticate } from "../middlewares/authorization.middleware";
import { AllAdmins } from "../types/global.types";
import { upload } from "../middlewares/file-uploader.middleware";

// multer uploader
const uploader = upload();

const router = express.Router();

//public routes
router.get("/", getAll);
router.get("/:id", getbyId);

//private routes
router.post(
    "/",
     authenticate(AllAdmins),
  uploader.fields([
    {
      name: "cover_image",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 5,
    },
  ]),

  create
);



router.put("/:id", authenticate(AllAdmins), uploader.fields([
  {
    name: 'cover_image',
    maxCount: 1
  }, 

   { 
     name: 'images',
     maxCount:5, 
   }
]),update
  
);


router.delete("/:id", authenticate(AllAdmins), remove);

export default router;
