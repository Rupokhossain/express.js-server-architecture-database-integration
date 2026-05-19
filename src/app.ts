import express, {
  type Application,
  type Request,
  type Response,
} from "express";
const app: Application = express();

import { userRoute } from "./modules/user/user.route";

import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";
import logger from "./middleware/logger";
import CookieParser from "cookie-parser";


app.use(express.json());
app.use(logger)
app.use(CookieParser())


app.get("/", (req: Request, res: Response) => {
  //   res.send('Hello World!')
  res.status(200).json({
    message: "Express Server",
    author: "Next Level",
  });
});

app.use("/users", userRoute);
app.use("/profile", profileRoute);
app.use("/auth", authRoute);







export default app;
