const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const engine = require("ejs-mate");
const methodOverride = require("method-override");
const programRoutes = require("./routes/programRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const personalRoutes = require("./routes/personalRoutes");
const session = require("express-session");
const passport = require("passport");
const PassportLocal = require("passport-local");
const Personal = require("./models/personalSchema");

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

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new PassportLocal(Personal.authenticate()));
passport.serializeUser(Personal.serializeUser());
passport.deserializeUser(Personal.deserializeUser());

app.use("/programs", programRoutes);
app.use("/programs/:id", workoutRoutes);
app.use("/programs/:id/workouts/:workoutId", exerciseRoutes);
app.use("/", personalRoutes)

//Shows landing page
app.get("/", (req, res) => {
    res.render("workout/greet");
});

app.listen(3000, () => {
    console.log("Localhost 3000");
});