
const db = require("../models");
const UserData = db.UserData;
const UserItems = db.UserItems;
const UserRoles = db.Role;
const User= db.User;
const Items=db.Items;
const SubItems=db.SubItems;
const UserDataExt = db.UserDataExt;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  const nameId = req.userId; // Assuming you have the user ID available in the request


  // Retrieve the associated data for the given user ID
  UserData.findAll({ where: { nameId } })
    .then((userData) => {
      // Fetch the corresponding usernames for the nameIds
      const nameIds = userData.map((data) => data.userId);
      User.findAll({ where: { id: nameIds } })
        .then((users) => {
          // Map the usernames to the userData
          
          const userDataWithUsername = userData.map((data) => {
            const user = users.find((user) => user.id === data.userId);
            return {
              ...data.toJSON(),
              userName: user ? user.username : null,
            };
          });
          res.send(userDataWithUsername);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving usernames.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving user data.",
      });
    });
};

exports.userBoardAdmin = (req, res) => {
  const userId = req.userId; // Assuming you have the user ID available in the request

  // Retrieve the associated data for the given user ID
  UserData.findAll({ where: { userId } })
    .then((userData) => {
      // Fetch the corresponding usernames for the nameIds
      const nameIds = userData.map((data) => data.nameId);
      User.findAll({ where: { id: nameIds } })
        .then((users) => {
          // Map the usernames to the userData
          const userDataWithUsername = userData.map((data) => {
            const user = users.find((user) => user.id === data.nameId);
           
            if(data.nameId){
              return {
                
                ...data.toJSON(),
                userName: user ? user.username: null,
              }
              }
              else{
                return {
                  ...data.toJSON(),
                }
              };
          });
          res.send(userDataWithUsername);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving usernames.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving user data.",
      });
    });
};

exports.itemBoard = (req, res) => {
  const userDatumId = req.query.DatumId;

  const userItemsPromise = UserItems.findAll({ where: { userDatumId } });
  const userDataExtPromise = UserDataExt.findOne({ where: { userDatumId } });

  Promise.all([userItemsPromise, userDataExtPromise])
    .then(([userItems, userDataExt]) => {
      const response = {
        userItems,
        userDataExt,
      };
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Some error occurred while retrieving items.",
      });
    });
};





exports.adminBoard = (req, res) => {
  Promise.all([
    User.findAll({
      attributes: ['id', 'username'],
      include: [
        {
          model: UserRoles,
          where: { Id: 1 },
          through: { attributes: [] }
        }
      ]
    }),
    Items.findAll(),
    SubItems.findAll()
  ])
    .then(([users, items,subItems]) => {
      // Process the retrieved users and items
      res.json({ users, items,subItems });
    })
    .catch((err) => {
      res.status(500).json({
        message:
          err.message || "Some error occurred while retrieving data.",
      });
    });
};

exports.insertFormData = (req, res) => {
  const { companyName, date, email, nameId,userName, quantity,phoneCode,phone,pickupDate,pickupLocation, ...items } = req.body;
  const userId = req.userId; // Assuming req.userId contains the user ID

  return User.findByPk(userId)
    .then((user) => {
      if (!user) {
        throw new Error("User not found");
      }

      const userIdd = user.id;
      const myEmail =user.email;

      return UserData.create({
        companyName: companyName,
        date: date,
        email: email,
        nameId: nameId,
        myEmail: myEmail,
        userName: userName,
        userId: userIdd,
      }).then((userData) => {
        return UserDataExt.create({
          phoneCode: phoneCode || null, 
          phone: phone,
          pickupLocation: pickupLocation,
          pickupDate: pickupDate,
          userDatumId: userData.id,
        }).then(() => {
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


          return Promise.all(itemPromises);
        });
      });
    })
    .then(() => {
      res.status(200).json({ message: "Form data inserted successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Error inserting form data" });
    });
};

// exports.adminSubItems = (req,res) {
//  
//}
// exports.adminBoard = (req, res) => {
//   db.sequelize.query(
//     "SELECT u.id, u.username FROM users AS u JOIN user_roles AS ur ON u.id = ur.userId AND ur.roleId = 1;",
//     { type: db.sequelize.QueryTypes.SELECT }
//   )
//     .then(users => {
//       res.json(users);
//     })
//     .catch((err) => {
//       res.status(500).json({
//         message:
//           err.message || "Some error occurred while retrieving itmes.",
//       });
//   });
// };
// exports.changeStatus = async (req, res) => {
//   try {
//     const { id, newStatus } = req.body;
//     const data = await UserData.findByPk(id);
//     if (!data) {
//       throw new Error('User not found');
//     }
//     data.status = newStatus;
//     const updatedData = await data.save();
//     res.status(200).json(updatedData);
//   } catch (error) {
//     console.error('Error updating status:', error);
//     res.status(500).json({ message: 'Error updating status' });
//   }
// };
exports.changeStatus = (req, res) => {
  const { id, newStatus } = req.body;
  UserData.update(
    { status: newStatus },
    { where: { id: id } }
  )
    .then((result) => {
      // Check the number of affected rows to determine if the update was successful
      if (result[0] === 0) {
        return res.status(404).json({ error: 'User data not found.' });
      }
      
      return res.json({ message: 'Status updated successfully.' });
    })
    .catch((error) => {
      // Handle the error appropriately (e.g., return an error response)
      res.status(500).json({ error: 'An error occurred while updating the status.' });
    });
};