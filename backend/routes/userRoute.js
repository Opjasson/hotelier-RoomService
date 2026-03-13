import express from "express";
import {
    getUsers,
    createUser,
    updateUsersById,
    getUserById,
    deleteAkun,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/user", getUsers);
router.get("/user/:id", getUserById);
router.patch("/user/:id", updateUsersById);
router.post("/user", createUser);
router.delete("/user/:id", deleteAkun);

export default router;
