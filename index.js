var express = require("express");
var expressHbs = require("express-handlebars");
var app = express()
var path = require('path');
var dbConnect =
    "mongodb+srv://admin:admin@nodejs.rvlug.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
var multer = require("multer");
const mongoose = require("mongoose");
mongoose.connect(dbConnect, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});
var upload = multer({storage: storage});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("connected");
});

const user = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    email: String,
    phone: String,
    avatar: {
        data: Buffer,
        contentType: String,
    },
});

var userConnect = db.model("users", user);

// Delete
// var dellete = userConnect.remove({_id:'607c54a252719908c02abbf5'}, function (err) {
//     if (err) throw err;
//     console.log('Đã xóa thành công!!!')
// })

// //Update
// var edit = userConnect.update({_id: '607c532a52719908c02abbf4'},{name: 'Nguyễn Chí Trung'},function (err) {
//   if (err) throw err;
//   console.log('Đã sửa thành công!!!')
// })

app.get("/user", function (req, res, next) {
    userConnect.find({}, function (err, users) {
        res.send(users);
    });
});

app.listen(process.env.PORT || "3000");
app.engine(
    "handlebars",
    expressHbs({
        layoutsDir: __dirname + "/views/layouts",
        defaultLayout: "main",
    })
);
app.set("view engine", "handlebars");

app.use(express.static("views"));

app.get("/", function (request, response) {
    response.render("login");
});

app.get("/home", function (request, response) {
    response.render("home");
});

app.get("/profile", function (request, response) {
    response.render("profile");
});

app.get("/update", function (request, response) {
    response.render("update");
});

app.get("/add", function (request, response) {
    response.render("add");
});

/* POST home page. */
app.post("/insert", upload.single("avatar"), function (req, res) {
    userConnect({
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        avatar: {
            data: req.file.filename,
            contentType: "image/png",
        },
    }).save(function (err) {
        if (err) {
            res.render("add")
            alert('Error!!')
            console.log(err);
        } else {
            res.render("add")
            alert('OK')
            console.log('Đã lưu!!!')
        }
    });
});


