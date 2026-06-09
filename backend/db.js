const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://db_user:dbUserPassword@paytm.28nnkav.mongodb.net/");

const userSchema = mongoose.schema({

    username: String,
    password: String,
    firstName: String,
    lastName: String,
})

const User = mongoose.model("User", userSchema);

module.exports = {
    User
}
