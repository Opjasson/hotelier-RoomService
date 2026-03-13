import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Users from "./user.js";

const { DataTypes } = Sequelize;

const Login = db.define(
    "login",
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                notEmpty: false,
            },
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    },
    {
        freezeTableName: true, //opsi tambahan agar nama table pada DB sama dengan model
    }
);

Users.hasOne(Login);
Login.belongsTo(Users, { foreignKey: "userId" });

export default Login;
