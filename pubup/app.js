const express = require('express')
const bodyparser = require('body-parser')
const request = require("request");
const https = require("https")
const ejs = require('ejs')
const mongoose = require('mongoose');
const nodemailer = require('nodemailer')
const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')




const app = express();
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public/'));
app.use(bodyparser.urlencoded({ extended: true }))





// Mongodb connection url
mongoose.connect("mongodb://localhost:27017/clubs", { useNewUrlParser: true })

const userSchema = new mongoose.Schema({
    firstName: String,
    email: String,
    contactNumber: String,
    gender: String,
    birthday: String,
    aniversary: String,
    password: String

});

const clubdataSchema = new mongoose.Schema({
    clubname: String,
    email: String,
    contactnumber: String,
    disc: String,
    tagofevent: String,
    venue: String,
    entryfees: String,
    theme: String,
    dj: String,
    address: String

});

userSchema.plugin(passportLocalMongoose);
const clubUsers = mongoose.model("clubUsers", userSchema)
const clubowner = mongoose.model("clubowner", clubdataSchema)
passport.use(clubUsers.createStrategy());
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.get("/", function(req, res) {
    res.render("login")
})

app.get("/info", function(req, res) {
    res.render("info")
})

app.get("/clubs", function(req, res) {
    res.render("clubs")
})

app.get("/clubowners", function(req, res) {
    res.render("clubowners")
})

app.post("/clubowners", function(req, res) {
    const clubname = req.body.clubname
    const email = req.body.email
    const contactnumber = req.body.contactnumber
    const disc = req.body.disc
    const tagofevent = req.body.tagofevent
    const venue = req.body.venue
    const entryfees = req.body.entryfees
    const theme = req.body.theme
    const dj = req.body.dj
    const address = req.body.address

    const data = new clubowner({
        clubname: clubname,
        email: email,
        contactnumber: contactnumber,
        disc: disc,
        tagofevent: tagofevent,
        venue: venue,
        entryfees: entryfees,
        theme: theme,
        dj: dj,
        address: address
    })
    data.save()

    res.redirect("/clubowners")
})

app.post("/login", function(req, res) {
    clubUsers.register({ username: req.body.firstName }, req.body.password, function(err, user) {
        if (err) {
            console.log(err)
            res.redirect("login")
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("clubs")
            })
        }
    })
})


app.listen(process.env.PORT || 2000, function() {
    console.log("server is running successfully on port made by om kadam");
})