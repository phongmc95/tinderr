var express = require("express");
var expressHbs = require("express-handlebars");
var app = express();
app.listen(process.env.PORT || "3000");
app.engine(
  "handlebars",
  expressHbs({
    layoutsDir: __dirname + "/views/layouts",
    // layout cha mặc định
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");

app.use(express.static('views'))

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
