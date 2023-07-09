module.exports = (sequelize, Sequelize) => {
  const UserData = sequelize.define(
    "user_data",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nameId: {
        type: Sequelize.INTEGER,
      },
      companyName: {
        type: Sequelize.STRING,
      },
      myEmail: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      date: {
        type: Sequelize.DATE,
      },
      userName: {
        type: Sequelize.STRING,
      },
    }
  );

  return UserData;
};
