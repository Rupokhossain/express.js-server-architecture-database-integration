import { pool } from "../../db";
import type { IProduct } from "./product.interface";



const createProductIntoDB = async (payload: IProduct) => {
    const {title, price, category, stock} = payload;

    const queryText = `
        INSERT INTO products (title, price, category, stock)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    const values = [title, price, category, stock || 10];
    const result = await pool.query(queryText, values);
    return result.rows[0];

}

export const productService = {
    createProductIntoDB,
}