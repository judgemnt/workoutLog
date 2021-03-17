const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const PersonalSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    wilks: Number,
    BodyWeight: Number,
    BodyFatPercentage: Number,
    FatMass: Number,
    LeanMass: Number
});

PersonalSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Personal", PersonalSchema);