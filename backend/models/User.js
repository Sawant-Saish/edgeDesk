const mongoose = require('mongoose');
const { createModelWrapper } = require('../modelFactory');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const MongooseUser = mongoose.model('User', UserSchema);
module.exports = createModelWrapper('User', MongooseUser);
