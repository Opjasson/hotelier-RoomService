import cartModel from "../models/keranjangModel.js";

export const addCart = async (req, res) => {
    try {
        const { qty, productId, userId, transaksiId } = req.body;

        await cartModel.create({
            qty,
            productId,
            userId,
            transaksiId,
        });
        res.status(200).json({ msg: "Data berhasil dibuat!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const getCartAll = async (req, res) => {
    try {
        const response = await cartModel.findAll({
            attributes: [
                "productId",
                "qty",
                "transaksiId",
                "userId",
                "createdAt",
            ],
        });
        res.status(200).json({ response });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const updateCartById = async (req, res) => {
    try {
        const { qty } = req.body;
        await cartModel.update(
            {
                qty
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

export const deleteCartById = async (req, res) => {
    try {
        await cartModel.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({ msg: "Data berhasil dihapus!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};