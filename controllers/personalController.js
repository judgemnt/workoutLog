const wilksScore = []

module.exports.wilks = async (req, res) => {
    // res.render("personal/wilks")
    res.render("personal/wilks", { wilksScore });
};

module.exports.calculateWilks = async (req, res) => {
    await wilksScore.splice(0, 1)
    const { bodyweight, total, gender } = req.body.wilks;
    const wilks = () => {
        if (gender === "male") {
            const a = -216.0475144
            const b = 16.2606339 * bodyweight
            const c = -0.002388645 * Math.pow(bodyweight, 2)
            const d = -0.00113732 * Math.pow(bodyweight, 3)
            const e = 0.00000701863 * Math.pow(bodyweight, 4)
            const f = -0.00000001291 * Math.pow(bodyweight, 5)
            const coefficient = (500 / (a + b + c + d + e + f))
            return Math.round(total * coefficient)
        } else {
            const a = 594.3174778
            const b = -27.23842536 * bodyweight
            const c = 0.8211222687 * Math.pow(bodyweight, 2)
            const d = -0.00930733913 * Math.pow(bodyweight, 3)
            const e = 0.00004731582 * Math.pow(bodyweight, 4)
            const f = -0.00000009054 * Math.pow(bodyweight, 5)
            const coefficient = (500 / (a + b + c + d + e + f))
            return Math.round(total * coefficient)
        };
    };
    const calculation = wilks();
    wilksScore.push(calculation);
    res.redirect("/personal/wilks");
};