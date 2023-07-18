module.exports = (sequelize, Sequelize) => {
    const UserItems = sequelize.define(
      "user_items",
      {
        itemName: {
          type: Sequelize.STRING,
        },
        itemType: {
          type: Sequelize.STRING,
        },        
        itemQuantity: {
          type: Sequelize.INTEGER,
        },
        receivedQuantity: {
          type: Sequelize.INTEGER,
        }
      },
      {
        timestamps: false,
      });
    return UserItems;
  };