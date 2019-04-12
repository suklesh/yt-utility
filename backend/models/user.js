const mongoose = require('mongoose');
const uniqueVal = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: { type: String, required: true }
});

// the plugin below helps in adding unique email id as the login
userSchema.plugin(uniqueVal);

module.exports = mongoose.model("User", userSchema);
