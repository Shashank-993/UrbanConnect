const mongoose = require("mongoose");
const User = require("./src/models/ProfileModel"); // Adjust path if necessary

mongoose.connect("mongodb://localhost:27017/node_internship").then(async () => {
  const users = await User.find();
  for (let user of users) {
    if (user.profilePicture && user.profilePicture.startsWith("./uploads/")) {
      user.profilePicture = user.profilePicture.replace(
        "./uploads/",
        "/uploads/"
      );
      await user.save();
    }
  }
  console.log("Profile picture paths updated.");
  mongoose.connection.close();
});
