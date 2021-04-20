const Personal = require("../models/personalSchema");
//user currently set to "'little Jimmy' will need to change everything to look for the current user once the user schema is established"

//Show User Registration Form
module.exports.registerForm = (req, res) => {
    res.render("personal/register");
};

//Create new User
module.exports.register = async (req, res) => {
    //defining constants
    const { email, username, password } = req.body.user;
    const user = new Personal({ email, username });
    //saving to DB
    const registeredUser = await Personal.register(user, password);
    //render
    res.redirect("/programs")
};

//Show login Form
module.exports.loginForm = (req, res) => {
    res.render("personal/login");
};

//Login
module.exports.login = (req, res) => {
    //Login message
    req.flash("success", "welcome");
    //Move user to previously opened page
    const redirectUrl = req.session.returnTo || "/programs";
    delete req.session.returnTo;
    //render previous page
    res.redirect(redirectUrl);
}

//Logout
module.exports.logout = (req, res) => {
    req.logout();
    res.redirect("/programs");
};

//Show Wilks calculator
module.exports.wilks = async (req, res) => {
    //Determine whether a user is logged in or not
    if (req.user) {
        const personal = await Personal.findById(req.user._id);
        //render page if user is logged in
        res.render("personal/wilks", { personal });
    } else {
        //render page if user is not logged in
        res.render("personal/wilks");
    };
};

//Calculate Wilks
module.exports.calculateWilks = async (req, res) => {
    //defining constants
    const { bodyweight, total, gender } = req.body.wilks;
    //wilks calculator, gender factored in by if statements
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
    //Flash result if no user logged in or save results to personal Schema
    if (!req.isAuthenticated()) {
        req.flash("calc", wilks());
    } else {
        await Personal.findByIdAndUpdate(req.user._id, { wilks: wilks() });
    };
    //render
    res.redirect("/wilks");
};

//Show bodyfat estimate calculator
module.exports.bodyFat = async (req, res) => {
    //Determine whether a user is logged in or not
    if (!req.user) {
        //render page if user is not logged in
        res.render("personal/bodyFat");
    } else {
        const personal = await Personal.findById(req.user._id);
        //render page if user is logged in
        res.render("personal/bodyFat", { personal });
    };
};

//Calculate body fat percentage
module.exports.calculateBF = async (req, res) => {
    //defining constants
    const gender = req.body.bfCalc.gender;
    const weight = parseInt(req.body.bfCalc.weight);
    const height = parseInt(req.body.bfCalc.height);
    const waist = parseInt(req.body.bfCalc.waist);
    const hip = parseInt(req.body.bfCalc.hip);
    const neck = parseInt(req.body.bfCalc.neck);
    //Calculating bodyfat percentage based on gender
    const bodyFatP = () => {
        if (gender === "male") {
            const bf = Math.round(495 / (1.0324 - .19077 * Math.log10(waist - neck) + .15456 * Math.log10(height)) - 450);
            return bf
        } else {
            const bf = Math.round(495 / (1.29579 - .35004 * Math.log10(waist + hip - neck) + .22100 * Math.log10(height)) - 450);
            return bf
        };
    };
    //Additional calculations based on bodyfatpercentage
    const bodyFat = bodyFatP();
    const fm = weight * bodyFat / 100;
    const lm = weight - fm;
    //Flash results if no user logged in, otherwise save results to personal Schema
    if (!req.isAuthenticated()) {
        const result = [bodyFat, fm, lm];
        req.flash("bodyFat", result);
    } else {
        await Personal.findByIdAndUpdate(req.user._id, { BodyFatPercentage: bodyFat, LeanMass: lm, FatMass: fm, BodyWeight: weight });
    };
    //render
    res.redirect("/bfCalc");
};