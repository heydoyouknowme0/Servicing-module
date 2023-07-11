module.exports = {
  HOST: "containers-us-west-25.railway.app",
  USER: "root",
  PASSWORD: "DEq5HuveocVQjhIFYo18",
  DB: "railway",
  dialect: "mysql",
  port:6006,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
