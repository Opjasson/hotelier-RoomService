import db from "../config/database.js";

import { INTEGER, Sequelize, STRING, TEXT } from "sequelize";

const product = db.define("product", {
    nama_product: {
        type: STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    kategori_product: {
        type: STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    deskripsi: {
        type: TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    img_product: {
        type: STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    harga_product: {
        type: INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    promo: {
        type: STRING,
        allowNull: true,
        validate: {
            notEmpty: false,
        },
    },
});

export default product;