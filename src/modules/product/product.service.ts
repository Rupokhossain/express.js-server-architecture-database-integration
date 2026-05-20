import { pool } from "../../db";
import type { IProduct } from "./product.interface";

const createProductIntoDB = async (payload: IProduct) => {
  const { title, price, category, stock } = payload;

  const queryText = `
        INSERT INTO products (title, price, category, stock)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

  const values = [title, price, category, stock || 10];
  const result = await pool.query(queryText, values);
  return result.rows[0];
};

const getProductIntoDB = async () => {
  const result = await pool.query(`
            SELECT * FROM products
        `);
  return result;
};

const getSingleProductIntoDB = async (id: string) => {
  const result = await pool.query(
    `
            SELECT * FROM products WHERE id=$1
        `,
    [id],
  );
  return result;
};

const updateProductIntoDB = async (id: string, payload: IProduct) => {
  const { title, price, category, stock } = payload;

  const result = await pool.query(
    `
        UPDATE products
        SET
        title=COALESCE(1$, title),
        price=COALESCE(2$, price),
        category=COALESCE(3$, category),
        stock=COALESCE(4$, stock)

        WHERE id=$5 RETURNING *

    `,
    [title, price, category, stock],
  );
  return result.rows[0];
};

const deleteProductIntoDB = async (id: string) => {
    const result = await pool.query(
        
        `
            DELETE FROM products WHERE id=$1
        
        `,
        [id],
    
    );
    return result
}

export const productService = {
  createProductIntoDB,
  getProductIntoDB,
  getSingleProductIntoDB,
  updateProductIntoDB,
  deleteProductIntoDB
};
