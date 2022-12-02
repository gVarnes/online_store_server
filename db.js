import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

dotenv.config();

let sequelize;
if (process.env.NODE_ENV) {
  sequelize = new Sequelize(process.env.DATABASE_URL);
} else {
  sequelize = new Sequelize(
    "postgres://postgres:gvarnes2304@localhost/online_store"
  );
}
// const sequelize = new Sequelize(
//   "postgres://postgres:gvarnes2304@localhost/online_store"
// );

export default sequelize;
