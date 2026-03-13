import Login from "../models/loginModel.js";
import Users from "../models/user.js";
import argon2 from "argon2";

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await Users.findOne({ where: { email } });
    if (!user) {
        return res.status(401).json({
            message: "Email yang anda masukan salah",
        });
    }
    const isValidPassword = await argon2.verify(user.password, password);
    if (!isValidPassword) {
        return res.status(401).json({ message: "password salah" });
    }

    function generateRandomString(length) {
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * characters.length)
            );
        }
        return result;
    }

    const randomString = generateRandomString(10);
    Login.create({
        userId: user.id,
        token: randomString,
    });
    res.status(201).json({ message: "Login succesfully", response: user });
};

export async function getLogin(req, res) {
    try {
        const response = await Login.findAll();

        res.status(200).json(response);
    } catch (error) {
        response.status(500).json({ msg: error.message });
    }
}

// Delete data
export async function deleteLogin(req, res) {
    const data = await Login.findOne({
        where: {
            id: req.params.id,
        },
    });
    if (!data) return res.status(404).json({ msg: "Data tidak ditemukan!" });
    try {
        await Login.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({ msg: "Data berhasil dihapus!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}


export const forgotPassword = async (req, res) => {
    const { email, password, confPassword } = req.body;
    const user = await Users.findOne({ where: { email } });
    if (!user) {
        return res.status(401).json({
            message: "Email yang anda masukan salah",
        });
    }
    res.status(200).json(user);
};