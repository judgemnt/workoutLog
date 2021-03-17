const Personal = require("../models/personalSchema");
//user currently set to "'little Jimmy' will need to change everything to look for the current user once the user schema is established"

//Show User Registration Form
module.exports.registerForm = (req, res) => {
    res.render("personal/register");
};

//Create new User
module.exports.register = async (req, res) => {
    const { email, username, password } = req.body.user;
    const user = new Personal({ email, username });
    const registeredUser = await Personal.register(user, password);
    console.log(registeredUser);
    res.redirect("/register")
};

//Show login Form
module.exports.loginForm = (req, res) => {
    res.render("personal/login");
};

//Login
module.exports.login = (req, res) => {
    req.flash("success", "welcome");
    const redirectUrl = req.session.returnTo || "/programs";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

//Logout
module.exports.logout = (req, res) => {
    req.logout();
    res.redirect("/programs");
};

//Show Wilks calculator
module.exports.wilks = (req, res) => {
    res.render("personal/wilks");
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
    req.flash("calc", wilks());
    res.redirect("/wilks");
};

//Show bodyfat estimate calculator
module.exports.bodyFat = (req, res) => {
    res.render("personal/bodyFat");
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
    const bodyFat = bodyFatP();
    const fm = weight * bodyFat / 100;
    const lm = weight - fm;
    const result = [bodyFat, fm, lm];
    req.flash("bodyFat", result);
    res.redirect("/bfCalc");
};