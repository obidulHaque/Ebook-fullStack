import express from "express";

import { createUser, Login } from "./authController";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", Login);

export default router;
