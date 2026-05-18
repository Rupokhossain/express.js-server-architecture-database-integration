import express, {
  type Application,
  type Request,
  type Response,
} from "express";
const app: Application = express();
const port = config.port;

import { Pool } from "pg";
import config from "./config";

app.use(express.json());

const pool = new Pool({
  connectionString: config.connection_string,
});

const initDB = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(20),
            email VARCHAR(20) NOT NULL,
            password VARCHAR(20) NOT NULL,
            is_active BOOLEAN DEFAULT true,
            age INT,

            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `);
    console.log("database connected successfully!");
  } catch (error) {
    console.log(error);
  }
};
initDB();

app.get("/", (req: Request, res: Response) => {
  //   res.send('Hello World!')
  res.status(200).json({
    message: "Express Server",
    author: "Next Level",
  });
});

app.post("/users", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const queryText = `
                INSERT INTO users (name, email, password)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;

    const values = [name, email, password];
    const result = await pool.query(queryText, values);

    res.status(201).json({
      message: "User created successfully!",
      user: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
            SELECT * FROM users
            `);
    res.status(200).json({
      success: true,
      message: "Users retrived successfully!",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.get("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
            SELECT * FROM users WHERE id=$1

            `,
      [id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User Not found!",
        data: {},
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.put("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, password, age, is_active } = req.body;

  // console.log("ID : " ,id);
  // console.log({name, password, age, is_active});

  try {
    const result = await pool.query(
      `
        UPDATE users
         SET 
         name=COALESCE($1, name),
         password=COALESCE($2, password), 
         age=COALESCE($3, age), 
         is_active=COALESCE($4, is_active)

         WHERE id=$5 RETURNING *
      `,
      [name, password, age, is_active, id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User Not found!",
      });
    }

    // console.log(result)

    res.status(200).json({
      success: true,
      message: "User updated successfully!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
        DELETE FROM users WHERE id=$1
      `,
      [id],
    );

    if(result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User Not Found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully!",
      data: {},
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
