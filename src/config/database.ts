import { Sequelize } from "sequelize";

export const database = new Sequelize({
  database: 'lol',
  dialect: "sqlite",
  storage: "lol.db",
});