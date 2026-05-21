import { Router } from "express";
import { productController } from "./product.controller";
import auth from "../../middleware/auth";

const router = Router()

router.post("/", auth("admin"), productController.createProduct);

router.get("/", productController.getAllProducts);

router.get("/:id", productController.getSingleProducts);

router.put("/:id", productController.updateProduct);

router.delete("/:id", productController.deleteProduct);


export const product =  router;