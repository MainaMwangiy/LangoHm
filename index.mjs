import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
dotenv.config();
import routes from "./routes/index.js";
import { executeQuery } from "./models/index.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to LangoHM API"
    });
});
app.use("/auth", routes.auth);
app.use("/vehicles", routes.vehicles);

// Send notification
app.all('/api/notifications', async (req, res) => {
    const { senderId, receiverId, content, notificationType } = { ...req.body, ...req.query, ...req.params };
    const result = await executeQuery(
        'INSERT INTO notifications (senderId, receiverId, content, notificationType) VALUES ($1, $2, $3, $4) RETURNING *',
        [senderId, receiverId, content, notificationType]
    );
    res.status(200).json({ success: true, data: result });
});

// Get all notification - for admin
app.all('/api/notifications/all', async (req, res) => {
    const sql = 'SELECT * FROM notifications';
    const results = await executeQuery(sql);
    res.status(200).json({ success: true, data: results });
});

// Fetch notifications for admin
app.all('/api/notifications/admin', async (req, res) => {
    const { id } = { ...req.body, ...req.query, ...req.params };
    const sql = 'SELECT * FROM notifications WHERE receiverId = $1';
    const results = await executeQuery(sql, [id]);
    res.status(200).json({ success: true, data: results });
});

// Fetch notifications for a normal user
app.all('/api/notifications/user', async (req, res) => {
    const { id } = { ...req.body, ...req.query, ...req.params };
    const sql = 'SELECT * FROM notifications WHERE receiverId = $1';
    const results = await executeQuery(sql, [id]);
    res.status(200).json({ success: true, data: results });
});

// Mark as read
app.all('/api/notifications/read/:id', async (req, res) => {
    const { id } = req.params;
    const results = await executeQuery(
        'UPDATE notifications SET status = \'read\' WHERE notificationId = $1 RETURNING *',
        [id]
    );
    res.status(200).json({ success: true, data: results });
});

app.listen(port, console.log("App running on port: ", port))