module.exports = (sequelize, Sequelize) => {
  const UserData = sequelize.define(
    "user_data",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      companyName: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      userName: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      phoneCode: {
        type: Sequelize.STRING,
      },
      pickupLocation:{
        type: Sequelize.STRING,
      },
      pickupDate: {
        type: Sequelize.DATE,
      },
      image: {
        type: Sequelize.JSON,
      }
    }
  );

  return UserData;
};
