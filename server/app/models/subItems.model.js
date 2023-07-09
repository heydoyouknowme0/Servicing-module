module.exports = (sequelize, Sequelize) => {
    const SubItems = sequelize.define(
      "sub_items",
      {
        typeId:{
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        itemType: {
          type: Sequelize.STRING,
        }
      },
      {
        timestamps: false,
      });
    return SubItems;
  };
