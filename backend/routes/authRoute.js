import express from "express";
import {
    forgotPassword,
    login,
    deleteLogin,
    getLogin,
} from "../controllers/authController.js";

const route = express.Router();

route.post("/login", login);
route.post("/forgotPass", forgotPassword);
route.get("/login", getLogin);
route.delete("/login/:id", deleteLogin);

export default route;
