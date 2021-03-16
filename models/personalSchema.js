const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PersonalSchema = new Schema({
    user: String,
    wilks: Number,
    BodyWeight: Number,
    BodyFatPercentage: Number,
    FatMass: Number,
    LeanMass: Number
});

module.exports = mongoose.model("Personal", PersonalSchema);