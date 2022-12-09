const mongoose = require("mongoose");

const databaseConnect = () => {
  mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
    })
    .then(() => {
      console.log("connected to mongodb");
    })
    .catch((error) => {
      console.log(error);
    });
};
module.exports = databaseConnect;
