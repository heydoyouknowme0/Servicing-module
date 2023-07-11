module.exports = {
  HOST: "containers-us-west-184.railway.app",
  USER: "root",
  PASSWORD: "DzLloFtst4xRYQyAQn7g",
  DB: "railway",
  dialect: "mysql",
  port:7473,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
