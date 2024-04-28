// untuk running ketikkan saja node .\seed.js

const mongoose = require("mongoose");
const User = require("./model/user");

async function seedData() {
  // Connection URL
  const uri = "mongodb://127.0.0.1:27017/automation";
  mongoose.set("strictQuery", false);
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to db");
    })
    .catch((err) => {
      console.log("error", err);
    });
  const user = {
    name: "Admin",
    username: "admin",
    password: "admin",
    isAdmin: true,
  };

  const seedDB = async () => {
    await User.create(user);
  };

  seedDB().then(() => {
    mongoose.connection.close();
    console.log("seed success");
  });
}

seedData();
