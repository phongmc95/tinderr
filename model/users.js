const mongoose = require('mongoose');

const User = new mongoose.Schema({
  name: String,
  age: String,
  address: String,
  avatar: String,
  email: String,
  phone: String,
});

mongoose.model('users', User);
