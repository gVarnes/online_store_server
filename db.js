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
const sequelize = new Sequelize(env.username, env.database, env.password, env);

// let sequelize;
// if (process.env.NODE_ENV) {
//   sequelize = new Sequelize(process.env.DATABASE_URL);
// } else {
//   sequelize = new Sequelize(
//     "postgres://postgres:gvarnes2304@localhost/online_store"
//   );
// }
// const sequelize = new Sequelize(
//   "postgres://postgres:gvarnes2304@localhost/online_store"
// );

export default sequelize;
