import type { NextFunction, Request, Response } from "express";
import { productService } from "./product.service";

const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await productService.createProductIntoDB(req.body);

        res.status(201).json({
            success: true,
            message: "Product created successfully!",
            data: result,
        })
    } catch (error: any) {
        next(error);
    }
}

export const productController = {
    createProduct
}