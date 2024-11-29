import app from "./src/app";
import { _confiq } from "./src/config/Config";
import connectDB from "./src/db/dbConnect";

const startServer = async () => {
  const port = _confiq.port || 3000;

  connectDB();

  app.listen(port, () => {
    console.log(`server listening on port ${port}`);
  });
};

startServer();
