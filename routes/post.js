const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: String,
    description: String,
    contract: String,
    image: String,
}); 

const Post = mongoose.model('post', userSchema);

module.exports = Post;