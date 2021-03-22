const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const engine = require("ejs-mate");
const methodOverride = require("method-override");
const publicRoutes = require("./routes/publicRoutes");
const programRoutes = require("./routes/programRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const personalRoutes = require("./routes/personalRoutes");
const session = require("express-session");
const passport = require("passport");
const PassportLocal = require("passport-local");
const Personal = require("./models/personalSchema");
const flash = require("connect-flash")

mongoose.connect('mongodb://localhost:27017/workoutLog', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        console.log("Connected");
    })
    .catch((e) => {
        console.log("Connection error");
        console.log(e);
    });
const sessionConfig = {
    secret: "shouldbesecret",
    resave: false,
    saveUninitialized: false
};

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(session(sessionConfig));
app.use(flash());

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new PassportLocal(Personal.authenticate()));
passport.serializeUser(Personal.serializeUser());
passport.deserializeUser(Personal.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.calc = req.flash("calc")
    res.locals.bodyFat = req.flash("bodyFat")
    next();
});

app.use("/", personalRoutes);
app.use("/programs", publicRoutes);
app.use("/user/programs", programRoutes);
app.use("/user/programs/:id/", workoutRoutes);
app.use("/user/programs/:id/workouts/:workoutId", exerciseRoutes);


//Shows landing page
app.get("/", (req, res) => {
    res.render("greet");
});

app.listen(3000, () => {
    console.log("Localhost 3000");
});