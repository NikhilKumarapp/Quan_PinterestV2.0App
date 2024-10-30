const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect('mongodb+srv://nikhilkappincuba:DFqz9iO5UFthGQqO@pinterestapp.jfts1.mongodb.net/?retryWrites=true&w=majority&appName=PinterestApp');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    contract: String,
    profileImage: String,
    boards:{
      type: Array,
      default: []
    },
    posts:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post'
    }]
}); 


userSchema.plugin(plm);
// Create the User model
const User = mongoose.model('user', userSchema);

module.exports = User;