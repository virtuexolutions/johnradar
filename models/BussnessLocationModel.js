const mongoose  = require("mongoose");

const BusinessSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      require: true,
    },
    Latitude: {
      type: String,
      require: true,
    },
    Longtitude: {
      type: String,
      require: true,
    },
    BussinessName: {
      type: String,
      require: true,
    },
    PhoneNumber: {
      type: String,
      require: true,
    },
    UserEmail: {
      type: String,
      required: true,
    },
  });
  

const BusinessLocation = mongoose.model("BusinessLocation", BusinessSchema);

module.exports  = BusinessLocation;
