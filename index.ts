import express, { Request, Response, Application, NextFunction } from "express";
// import { initialiseSupertokensAuth } from "./utils/auth";
import apiRoutes from "./routes";
import bootService from "./services/boot-service";

require("dotenv").config();

// const websitePort: string | number = process.env.WEBPORT || 3000;
// const websiteDomain: string =
//   process.env.APP_WEBSITE_URL || `http://localhost:${websitePort}`;
const apiPort: string | number = process.env.PORT || 4000;
// const apiDomain: string =
//   process.env.APP_API_URL || `http://localhost:${apiPort}`;

// initialiseSupertokensAuth(websiteDomain, apiDomain);

const app: Application = express();

app.use(express.json());
// app.use(middleware());

// TODO: API Routes
app.use("/api", apiRoutes);

// app.use(errorHandler());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send({
    message: "Not found",
  });
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(error?.statusCode || 500).json({
    message: error?.message || "Server Error",
  });
});

app.listen(apiPort, () => {
  console.log(`Server is running on port ${apiPort}`);
  // bootService.loadPlansIntoDatabase();
});