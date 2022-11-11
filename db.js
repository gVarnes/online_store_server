import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "postgres://postgres:gvarnes2304@localhost:5432/online_store"
);

export default sequelize;
