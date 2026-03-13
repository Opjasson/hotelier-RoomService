// import { Sequelize, where } from "sequelize";
import product from "../models/productModel.js";

export const createproduct = async (req, res) => {
    const { nama_product, deskripsi ,harga_product, img_product, kategori_product, promo } = req.body;

    try {
        await product.create({
            nama_product,
            deskripsi,
            harga_product,
            img_product,
            kategori_product,
            promo
        });
        res.status(200).json({ msg: "product berhasil ditambahkan!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const getproduct = async (req, res) => {
    try {
        const response = await product.findAll({
            attributes: [
                "id",
                "nama_product",
                "deskripsi",
                "harga_product",
                "img_product",
                "kategori_product",
                "promo"
            ],
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const updateproductById = async (req, res) => {
    try {
        const {
            nama_product,
            deskripsi,
            harga_product,
            img_product,
            kategori_product,
            promo,
        } = req.body;
        await product.update(
            {
                nama_product,
                deskripsi,
                harga_product,
                img_product,
                kategori_product,
                promo,
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        res.status(200).json({ msg: "Data berhasil dirubah" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const getproductById = async (req, res) => {
    try {
        const response = await product.findOne({
            where: {
                id: req.params.id,
            },
        });

        if (!response) res.status(400).json({ msg: "Data tidak tersedia!" });

        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const deleteproductById = async (req, res) => {
    try {
        await product.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({ msg: "Data berhasil dihapus!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
