var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: String,
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    updated: { type: Date, default: Date.now },
    created: { type: Date, default: Date.now }
})

var postSchema = mongoose.Schema({
    content: String,
    updated: { type: Date, default: Date.now },
    created: { type: Date, default: Date.now }
})
