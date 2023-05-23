import app from "./utils/app";
import router from "./utils/router";
import cors from "cors";
import { clientOrigin, lambdaUrl } from "./config/config";
import { Request, Response, NextFunction } from "express";

// cors
const corsOptions = {
  origin: [clientOrigin, lambdaUrl],
  optionsSuccessStatus: 200,
};
app.use(cors());

app.use("/api", router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send(err.message || "500 Internal Server Error");
});

const port = process.env.SERVER_PORT || 8000;
app.listen(port, () => console.log(`Server running on port ${port}`));
