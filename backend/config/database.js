import { Sequelize } from "sequelize";

const db = new Sequelize("hotelpetra","root","", {
    host: "localhost",
    dialect: "mysql"
})

export default db;