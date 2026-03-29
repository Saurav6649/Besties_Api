const { default: mongoose } = require("mongoose");

export const connectDb = () => {
  mongoose
    .connect(process.env.MONGO_URI || 8080)
    .then(() => {
      console.log("db is connected");
    })
    .catch((err:any) => {
      console.log(err);
    });
};


