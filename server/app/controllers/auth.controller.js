const db = require("../models");
const config = require("../config/auth.config");
const User = db.User;
const Role = db.Role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    phone:req.body.phone,
    password: bcrypt.hashSync(req.body.password, 8),
    phoneCode: req.body.phoneCode
  })
  .then(user => {
    if (req.body.roles === true) {
      user.setRoles([2]).then(() => {
        res.send({ message: "Requester registered successfully!" });
      });
    } else if(req.body.roles === false){
      user.setRoles([3]).then(() => {
        res.send({ message: "Driver registered successfully!" });
      });
    } else {
      // user role = 1
      user.setRoles([1]).then(() => {
        res.send({ message: "User registered successfully!" });
      });
    }
  })
  
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 604800 // 24 hours
      });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
