module.exports = (sequelize, Sequelize) => {
    const UserDataExt = sequelize.define(
      "user_data_ext",
      {
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
          }
      },
      {
        timestamps: false,
      });
    UserDataExt.removeAttribute('id'); 
    return UserDataExt;
  };