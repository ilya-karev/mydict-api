const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://bender1000:" +
    process.env.MONGO_ATLAS_PW +
    "@main.6eef6rn.mongodb.net/?retryWrites=true&w=majority"
);
mongoose.Promise = global.Promise;
