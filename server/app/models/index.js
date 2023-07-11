const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,


    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("../models/user.model.js")(sequelize, Sequelize);
db.Role = require("../models/role.model.js")(sequelize, Sequelize);
db.UserData = require("../models/user_data.model.js")(sequelize, Sequelize);
db.UserItems = require("../models/user_items.model.js")(sequelize, Sequelize);
db.SubItems = require("../models/subItems.model.js")(sequelize, Sequelize);
db.Items = require("../models/items.model.js")(sequelize, Sequelize);

db.Role.belongsToMany(db.User, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.User.belongsToMany(db.Role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.UserData.belongsTo(db.User, { foreignKey: 'nameId', as: 'nameUser' });
db.User.hasMany(db.UserData, { foreignKey: 'nameId' });

db.UserData.belongsTo(db.User, { foreignKey: 'userId' });
db.User.hasMany(db.UserData, { foreignKey: 'userId' });


db.UserData.hasMany(db.UserItems);
db.UserItems.belongsTo(db.UserData);

db.Items.hasMany(db.SubItems);
db.SubItems.belongsTo(db.Items);

db.ROLES = ["user", "admin"];

module.exports = db;
