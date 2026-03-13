import express from "express";
import { createproduct, deleteproductById, getproduct, getproductById, updateproductById } from "../controllers/productController.js";

const route = express.Router();

route.get("/product", getproduct);
route.get("/product/:id", getproductById);
route.post("/product", createproduct);
route.delete("/product/:id", deleteproductById);
route.patch("/product/:id", updateproductById)

export default route;
