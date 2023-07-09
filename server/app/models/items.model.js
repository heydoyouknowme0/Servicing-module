module.exports = (sequelize, Sequelize) => {
    const Items = sequelize.define(
      "items",
      {
        itemId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },     
        itemName: {
          type: Sequelize.STRING,
        }
      },
      {
        timestamps: false,
      });
    return Items;
  };
  