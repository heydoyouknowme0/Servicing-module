const db = require("../models");
const UserData = db.user_data;
const UserItems = db.user_items;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  const userId = req.userId; // Assuming you have the user ID available in the request

  // Retrieve the associated data for the given user ID
  UserData.findAll({ where: { userId } })
    .then((userData) => {
      res.send(userData);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving user data.",
      });
    });
};
exports.itemBoard = (req, res) => {
  const userDatumId = req.query.userDatumId;
  UserItems.findAll({ where: { userDatumId } })
    .then((UserItems) => {
      res.send(UserItems);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving itmes.",
      });
    });
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};
