import Users from "../models/user.js";
import KeranjangModel from "../models/keranjangModel.js"
import argon2 from "argon2";

export const getUsers = async (req, res) => {
    try {
        const response = await Users.findAll({
            attributes: ["id", "email", "username", "role"],
        });
        res.status(200).json({ msg: "get data succesfully", data: response });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const response = await Users.findOne({
            where: {
                id: req.params.id,
            },
            include: [
                {
                    model : KeranjangModel
                }
            ]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const createUser = async (req, res) => {
    const { email, username, role, password, confPassword } = req.body;

    const alreadyEmail = await Users.findOne({
        where: {
            email: email,
        },
    });

    if (alreadyEmail) {
        return res.status(400).json({ msg: "Email sudah terpakai!" });
    }

    if (password !== confPassword) {
        return res
            .status(400)
            .json({ msg: "Password dan Confirm Password tidak cocok" });
    }

    const HashPassword = await argon2.hash(password);
    try {
        await Users.create({
            email,
            username,
            role,
            password: HashPassword,
        });
        res.status(201).json({ msg: "Register berhasil" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateUsersById = async (req, res) => {
    const { email, username, role, password, confPassword } = req.body;

    const getUserById = await Users.findOne({
        where: {
            id: req.params.id,
        },
    });

    if (password !== confPassword) {
        return res
            .status(400)
            .json({ msg: "Password dan Confirm Password tidak cocok" });
    }

    const HashPassword = await argon2.hash(password);
    try {
        await Users.update(
            {
                email,
                username,
                role,
                password: HashPassword,
            },
            {
                where: {
                    id: getUserById.id,
                },
            }
        );
        res.status(201).json({ msg: "Akun berhasil dirubah" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deleteAkun = async (req, res) => {
    try {
        await Users.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({ msg: "Akun berhasil dihapus!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
