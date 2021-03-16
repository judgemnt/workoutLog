const Personal = require("../models/personalSchema");
//user currently set to "'little Jimmy' will need to change everything to look for the current user once the user schema is established"


//Show Wilks calculator
module.exports.wilks = async (req, res) => {
    const user = await Personal.find({ user: "little Jimmy" })
    res.render("personal/wilks", { user });
};

//Calculate Wilks
module.exports.calculateWilks = async (req, res) => {
    const { bodyweight, total, gender } = req.body.wilks;
    const wilks = () => {
        if (gender === "male") {
            const a = -216.0475144;
            const b = 16.2606339 * bodyweight;
            const c = -0.002388645 * Math.pow(bodyweight, 2);
            const d = -0.00113732 * Math.pow(bodyweight, 3);
            const e = 0.00000701863 * Math.pow(bodyweight, 4);
            const f = -0.00000001291 * Math.pow(bodyweight, 5);
            const coefficient = (500 / (a + b + c + d + e + f));
            return Math.round(total * coefficient);
        } else {
            const a = 594.3174778;
            const b = -27.23842536 * bodyweight;
            const c = 0.8211222687 * Math.pow(bodyweight, 2);
            const d = -0.00930733913 * Math.pow(bodyweight, 3);
            const e = 0.00004731582 * Math.pow(bodyweight, 4);
            const f = -0.00000009054 * Math.pow(bodyweight, 5);
            const coefficient = (500 / (a + b + c + d + e + f));
            return Math.round(total * coefficient);
        };
    };
    const user = await Personal.findOneAndUpdate({ user: "little Jimmy" }, { wilks: wilks() });
    res.redirect("/personal/wilks");
};

//Show bodyfat estimate calculator
module.exports.bodyFat = async (req, res) => {
    const user = await Personal.find({ user: "little Jimmy" });
    res.render("personal/bodyFat", { user });
};

//Calculate body fat percentage
module.exports.calculateBF = async (req, res) => {
    const gender = req.body.bfCalc.gender;
    const weight = parseInt(req.body.bfCalc.weight);
    const height = parseInt(req.body.bfCalc.height);
    const waist = parseInt(req.body.bfCalc.waist);
    const hip = parseInt(req.body.bfCalc.hip);
    const neck = parseInt(req.body.bfCalc.neck);
    const bodyFatP = () => {
        if (gender === "male") {
            const bf = Math.round(495 / (1.0324 - .19077 * Math.log10(waist - neck) + .15456 * Math.log10(height)) - 450);
            return bf
        } else {
            const bf = Math.round(495 / (1.29579 - .35004 * Math.log10(waist + hip - neck) + .22100 * Math.log10(height)) - 450);
            return bf
        };
    };
    const bodyFat = bodyFatP()
    const fm = weight * bodyFat / 100;
    const lm = weight - fm;
    const user = await Personal.findOneAndUpdate({ user: "little Jimmy" }, {
        BodyWeight: weight,
        BodyFatPercentage: bodyFat,
        FatMass: fm,
        LeanMass: lm
    })
    res.redirect("/personal/bfCalc")
};