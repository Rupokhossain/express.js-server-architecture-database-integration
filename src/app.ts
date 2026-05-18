import express, {
  type Application,
  type Request,
  type Response,
} from "express";
const app: Application = express();
const port = config.port;

import { Pool } from "pg";
import config from "./config";
import { userRoute } from "./modules/user/user.route";
import { pool } from "./db";

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  //   res.send('Hello World!')
  res.status(200).json({
    message: "Express Server",
    author: "Next Level",
  });
});

app.use("/users", userRoute);







export default app;
