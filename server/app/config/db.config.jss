module.exports = {
    HOST: "containers-us-west-184.railway.app",
    USER: "root",
    PASSWORD: "nVB3BD8LOxyxzTe37VHp",
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