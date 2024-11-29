import express from "express";
import authRoute from "./users/authRoute";
import bookRoute from "./book/bookRoute";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/books", bookRoute);

app.get("/", (req, res) => {
  res.send("node js typescript project template setup successfully done.. ");
});

export default app;
