import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";
import { config } from "./config/index";

dotenv.config();
const env = config[process.env.NODE_ENV || "development"];

// console.log(env);
// const sequelize = new Sequelize(
//   config[env].username,
//   config[env].database,
//   config[env].password,
//   config[env]
// );

console.log(env);

const sequelize = new Sequelize(env.database, env.username, env.password, env);

export default sequelize;
