

const mongoose= require('mongoose');

// User Model
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },username: {
    type: String,
    required: true,
    unique: true,
  },
 
});


const User = mongoose.model('User', UserSchema);

module.exports = User;
