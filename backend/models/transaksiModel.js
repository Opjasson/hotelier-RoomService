import { BOOLEAN, INTEGER, STRING, TEXT, UUIDV4 } from "sequelize";
import db from "../config/database.js";

const transaksiModel = db.define(
    "transaksi",
    {
        uuid: {
            type: STRING,
            defaultValue: UUIDV4,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        namaPelanggan: {
            type: STRING,
            allowNull: true,
            validate: {
                notEmpty: false,
            },
        },
        totalHarga: {
            type: INTEGER,
            defaultValue: 0,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        buktiBayar: {
            type: STRING,
            allowNull: true,
            validate: {
                notEmpty: false,
            },
        },
        catatanTambahan: {
            type: TEXT,
            allowNull: true,
            validate: {
                notEmpty: false,
            },
        },
        status: {
            type: BOOLEAN,
            allowNull: true,
            validate: {
                notEmpty: false,
            },
        },
        cash: {
            type: INTEGER,
            allowNull: true,
            validate: {
                notEmpty: false,
            },
        },
    },
    {
        freezeTableName: true,
    }
);

export default transaksiModel;
