import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
dotenv.config();
import routes from "./routes/index.js";
import * as db from "./models/index.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome",
    });
});
app.use("/auth", routes.auth);
app.use("/vehicles", routes.vehicles);

app.listen(port, console.log("App running on port: ", port))