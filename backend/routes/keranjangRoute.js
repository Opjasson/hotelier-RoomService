import express from "express";
import { addCart, deleteCartById, getCartAll, updateCartById } from "../controllers/keranjangControllers.js";

const route = express.Router();

route.get("/cart", getCartAll);
route.post("/cart", addCart);
route.patch("/cart/:id", updateCartById);
route.delete("/cart/:id", deleteCartById);


export default route;
