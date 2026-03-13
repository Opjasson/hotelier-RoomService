import db from "../config/database.js";
import { INTEGER, Sequelize } from "sequelize";
import barang from "./productModel.js";
import Users from "./user.js";
import transaksiModel from "./transaksiModel.js";

const cartModel = db.define(
    "keranjang",
    {
        qty: {
            type: INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    },
    {
        freezeTableName: true,
    }
);

barang.hasMany(cartModel);
cartModel.belongsTo(barang, { foreignKey: "productId" });

Users.hasMany(cartModel);
cartModel.belongsTo(Users, { foreignKey: "userId" });

transaksiModel.hasMany(cartModel);
cartModel.belongsTo(transaksiModel, { foreignKey: "transaksiId" });

export default cartModel;
