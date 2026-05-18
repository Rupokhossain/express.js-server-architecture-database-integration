import express, { type Application, type Request, type Response } from "express";
import { Pool } from "pg";
import config from "./config";
const port = config.port;

const app: Application = express();
app.use(express.json());

const pool = new Pool({
  connectionString: config.connection_string,
});

const initDB = async () => {
  await pool.query(
    `
        CREATE TABLE IF NOT EXISTS todos (
            id SERIAL PRIMARY KEY,
            task TEXT NOT NULL,
            is_completed BOOLEAN DEFAULT false
        )
        `
  );
  console.log("table ready!");
};

initDB();

app.post("/todos", async(req : Request, res : Response) => {
    const {task} = req.body;

    const queryText = "INSERT INTO todos (task) VALUES ($1) RETURNING *";

    const result = await pool.query(queryText, [task]);

    res.json(result.rows[0]);
});

app.get("/todos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todos");
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
