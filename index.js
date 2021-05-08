var express = require('express');
var app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('./model/users');
const Users = mongoose.model('users');

var dbConnect =
  'mongodb+srv://admin:admin@nodejs.rvlug.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(dbConnect, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error!'));
db.once('open', function () {
  console.log('Connected');
});

app.use(bodyParser.json());

app.post('/add', async (req, res) => {
  const user = new Users({
    name: req.body.name,
    age: req.body.age,
    address: req.body.address,
    avatar: req.body.avatar,
    email: req.body.email,
    phone: req.body.phone,
  });
  user
    .save()
    .then(data => {
      console.log(data);
      res.send(data);
    })
    .catch(err => console.log(err));
});

app.post('/delete', async (req, res) => {
  Users.findByIdAndRemove(req.body._id)
    .then(data => {
      console.log(data);
      res.send(data);
    })
    .catch(err => {
      console.log('error', err);
    });
});

app.post('/update', async (req, res) => {
  Users.findByIdAndUpdate(req.body._id, req.body)
    .then(data => {
      console.log(data);
      res.send(data);
    })
    .catch(err => {
      console.log('error', err);
    });
});

app.get('/', (req, res) => {
  Users.find({})
    .then(data => {
      console.log(data);
      res.send(data);
    })
    .catch(err => {
      console.log('error', err);
    });
});

app.listen(process.env.PORT || '3000');

module.exports = app;
