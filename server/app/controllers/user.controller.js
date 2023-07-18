const db = require("../models");
const { sequelize } = require("../models");
const UserData = db.UserData;
const UserItems = db.UserItems;
const UserRoles = db.Role;
const User = db.User;
const Items = db.Items;
const SubItems = db.SubItems;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoardDriver = async (req, res) => {
  try {
    const driverId = req.userId; // Assuming you have the user ID available in the request

    const userData = await UserData.findAll({
      where: { driverId },
      attributes: [
        'id',
        'servicerId',
        'driverId',
        'status',
        'createdAt',
        'email',
        'companyName',
        'userName',
        [sequelize.literal('nameUser.username'), 'servicer'],
        [sequelize.literal('User.username'), 'requester']
      ],
      include: [
        {
          model: User,
          attributes: [],
        },
        {
          model: User,
          as: 'nameUser',
          attributes: [],
        },
      ],
    });

    res.send(userData);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving user data.",
    });
  }
};

exports.userBoardServicer = async (req, res) => {
  try {
    const servicerId = req.userId; // Assuming you have the user ID available in the request

    const userData = await UserData.findAll({
      where: { servicerId },
      attributes: [
        'id',
        'servicerId',
        'driverId',
        'status',
        'createdAt',
        'email',
        'companyName',
        'userName',
        [sequelize.literal('driverUser.username'), 'driver'],
        [sequelize.literal('User.username'), 'requester']
      ],
      include: [
        {
          model: User,
          attributes: [],
        },
        {
          model: User,
          as: 'driverUser',
          attributes: [],
        },
      ],
    });

    res.send(userData);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving user data.",
    });
  }
};

exports.userBoardAdmin = async (req, res) => {
  try {
    const userId = req.userId; // Assuming you have the user ID available in the request

    const userData = await UserData.findAll({
      where: { userId },
      attributes: [
        'id',
        'servicerId',
        'driverId',
        'status',
        'createdAt',
        'email',
        'companyName',
        'userName',
        [sequelize.literal('driverUser.username'), 'driver'],
        [sequelize.literal('nameUser.username'), 'servicer']
      ],
      include: [
        {
          model: User,
          as: 'nameUser',
          attributes: [],
        },
        {
          model: User,
          as: 'driverUser',
          attributes: [],
        },
      ],
    });

    res.send(userData);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving user data.",
    });
  }
};

exports.itemBoard = async (req, res) => {
  try {
    const userDatumId = req.query.DatumId;
    const id = req.query.DatumId;

    const userItemsPromise = UserItems.findAll({ where: { userDatumId } });
    const userDataPromise = UserData.findOne({
      where: { id },
      attributes: [
        'pickupDate',
        'pickupLocation',
        'phoneCode',
        'phone',
        'image',
      ],
      include: [
        {
          model: User,
          attributes: ['username','email','phoneCode','phone'],
        },
        {
          model: User,
          as: 'nameUser',
          attributes: ['username','email','phoneCode','phone'],
        },
        {
          model: User,
          as: 'driverUser',
          attributes: ['username','email','phoneCode','phone'],
        },
      ],
    });

    const [userItems, userData] = await Promise.all([userItemsPromise, userDataPromise]);

    const response = {
      userItems,
      userData,
    };

    res.send(response);
  } catch (err) {
    res.status(500).send({
      message: "Some error occurred while retrieving items.",
    });
  }
};

exports.adminBoard = async (req, res) => {
  try {
    const [drivers,servicers, items, subItems] = await Promise.all([
      User.findAll({
        attributes: ['id', 'username'],
        include: [
          {
            model: UserRoles,
            where: { Id: 1 },
            attributes: []
          }
        ]
      }),
      User.findAll({
        attributes: ['id', 'username'],
        include: [
          {
            model: UserRoles,
            where: { Id: 3 },
            attributes: []
          }
        ]
      }),
      Items.findAll(),
      SubItems.findAll()
    ]);

    res.json({ drivers,servicers, items, subItems });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Some error occurred while retrieving data.",
    });
  }
};

exports.insertFormData = async (req, res) => {
  try {
    const { companyName, email, servicerId,driverId, userName, quantity, phoneCode, phone, pickupDate, pickupLocation, ...items } = req.body;
    const userId = req.userId;

    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const userIdd = user.id;

    const userData = await UserData.create({
      companyName: companyName,
      driverId:driverId,
      email: email,
      servicerId: servicerId,
      userName: userName,
      userId: userIdd,
      phoneCode: phoneCode,
      phone: phone,
      pickupLocation: pickupLocation,
      pickupDate: pickupDate,
    });

    const itemPromises = [];

    for (let i = 1; i <= quantity; i++) {
      const itemNames = items[`itemName${i}`].substring(items[`itemName${i}`].indexOf(".") + 1);
      const itemQuantitys = items[`itemQuantity${i}`];
      const itemTypes = items[`itemType${i}`];

      const itemPromise = UserItems.create({
        itemName: itemNames,
        itemQuantity: itemQuantitys,
        itemType: itemTypes,
        userDatumId: userData.id,
      });

      itemPromises.push(itemPromise);
    }

    await Promise.all(itemPromises);

    res.status(200).json({ message: "Form data inserted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error inserting form data" });
  }
};

exports.updateReceived = async (req, res) => {
  try {
    const receivedQuantities = req.body;

    // Iterate over the receivedQuantities object and update the records accordingly
    for (const itemId in receivedQuantities) {
      const receivedQuantity = receivedQuantities[itemId];

      await UserItems.update(
        { receivedQuantity },
        { where: { id: itemId } }
      );
    }

    // Return a success response
    return res.status(200).json({ message: 'Received quantities updated successfully' });
  } catch (error) {
    console.error('Error updating received quantities:', error);
    return res.status(500).json({ error: 'An error occurred while updating received quantities' });
  }
};

exports.deleteData = async (req, res) => {
  try {
    const { id } = req.query;

    const transaction = await sequelize.transaction();

    try {
      await UserItems.destroy({
        where: { userDatumId: id },
        transaction
      });

      const affectedRows = await UserData.destroy({
        where: { id },
        transaction
      });

      await transaction.commit();

      if (affectedRows === 0) {
        return res.status(404).json({ error: 'User data not found.' });
      }

      return res.json({ message: 'UserData and associated UserItems deleted successfully.' });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error deleting UserData and associated UserItems:', error);
    res.status(500).json({ error: 'An error occurred while deleting the data.' });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const { id, newStatus } = req.body;
    const data = await UserData.findByPk(id);
    if (!data) {
      throw new Error('User not found');
    }
    data.status = newStatus;
    const updatedData = await data.save();
    res.status(200).json(updatedData);
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Error updating status' });
  }
};
