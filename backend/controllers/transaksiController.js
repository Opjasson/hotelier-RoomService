import { where } from "sequelize";
import cartModel from "../models/keranjangModel.js";
import transaksiModel from "../models/transaksiModel.js";

export const addTransaksi = async (req, res) => {
    try {
        const { namaPelanggan } = req.body;
        const response = await transaksiModel.create({
            namaPelanggan,
        });
        res.status(200).json({ response });
    } catch (error) {
        req.status(400).json({ msg: error.message });
    }
};

export const getAllTransaksi = async (req, res) => {
    try {
        const response = await transaksiModel.findAll({
            include: [
                {
                    model: cartModel,
                },
            ],
        });
        res.status(200).json({ response });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const getTransaksiByUuid = async (req, res) => {
    try {
        const response = await transaksiModel.findOne({
            where: {
                uuid: req.params.id,
            },
            include: [
                {
                    model: cartModel,
                },
            ],
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const updateTransaksi = async (req, res) => {
    try {
        const {
            totalHarga,
            namaPelanggan,
            buktiBayar,
            catatanTambahan,
            status,
            cash
        } = req.body;
        await transaksiModel.update(
            {
                totalHarga,
                buktiBayar,
                namaPelanggan,
                catatanTambahan,
                status,
                cash
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        res.status(200).json({ msg: "Data berhasil dirubah!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const deleteTransaksi = async (req, res) => {
    try {
        await transaksiModel.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({ msg: "Data berhasil dihapus!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
