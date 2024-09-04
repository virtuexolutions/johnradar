const mongoose  = require("mongoose");

const AdsSchema = new mongoose.Schema({
    BussinessLocationID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusinessLocation', // Reference to the User model
        required: true,
    },
    BusinessCategory: {
        type: String,
        required: true
    },
    AdTitle: {
        type: String,
        required: true
    },
    Latitude: {
        type: String,
        require: true,
    },
    Longtitude: {
        type: String,
        require: true,
    },
    AdDescription: {
        type: String,
        required: true
    },
    images:{
        type:Array,
        // required:true
    },
});

const Ads = mongoose.model('Ads', AdsSchema);

module.exports  = Ads
