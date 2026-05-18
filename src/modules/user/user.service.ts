import { pool } from "../../db";
import type { IUSer } from "./user.interface";

const createUserIntoDB = async (payload: IUSer) => {
  const { name, email, password, age } = payload;

  const queryText = `
                INSERT INTO users (name, email, password)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;

  const values = [name, email, password];
  const result = await pool.query(queryText, values);

  return result;
};

const getUserIntoDB = async () => {
  const result = await pool.query(`
            SELECT * FROM users
            `);

  return result;
};

const getSingleUserDB = async (id: string) => {
  const result = await pool.query(
    `
            SELECT * FROM users WHERE id=$1

            `,
    [id],
  );
  return result;
};

const updateUserDB = async (id: string, payload: IUSer) => {
  const { name, password, age, is_active, email } = payload;

  const result = await pool.query(
    `
        UPDATE users
         SET
         name=COALESCE($1, name),
         password=COALESCE($2, password),
         age=COALESCE($3, age),
         is_active=COALESCE($4, is_active),
         email=COALESCE($5,email)

         WHERE id=$6 RETURNING *
      `,
    [name, email, password, age, is_active, id],
  );
  return result;
};

const deleteUserDB = async (id: string) => {
  const result = await pool.query(
    `
        DELETE FROM users WHERE id=$1
      `,
    [id],
  );

  return result;
};

export const userService = {
  createUserIntoDB,
  getUserIntoDB,
  getSingleUserDB,
  updateUserDB,
  deleteUserDB
};
