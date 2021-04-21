var express = require("express");
var expressHbs = require("express-handlebars");
var app = express();
var path = require("path");
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
var upload = multer({ storage: storage });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("connected");
});

const user = new mongoose.Schema({
  name: String,
  age: String,
  address: String,
  avatar: String,
});

var userConnect = db.model("users", user);

// // Delete
// var dellete = userConnect.remove({}, function (err) {
//     if (err) throw err;
//     console.log('Đã xóa thành công!!!')
// })

// //Update
// var edit = userConnect.update({_id: '607c5f6e80023b0f14b8b3ce'},{name: 'Nguyễn Chí Trung'},function (err) {
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
    name: req.body.name,
    age: req.body.age,
    address: req.body.address,
    avatar: req.body.avatar,
  }).save(function (err) {
    if (err) {
      res.render("add");
      console.log(err);
    } else {
      res.render("add");
      console.log("Đã lưu!!!");
    }
  });
});

app.patch("/update/:id", async (req, res) => {
  try {
    await userConnect.findByIdAndUpdate(req.params._id, req.body);

    await userConnect.save();
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const use = await userConnect.findByIdAndDelete(req.params._id, req.body);
    if (!use) res.status(404).send("not foud");
    res.status(200).send();
  } catch (error) {
    res.status(500).send(error);
  }
});
