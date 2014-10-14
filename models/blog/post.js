var mongoose      = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var configDB      = require('../../config/site.json').database.url;

var connection    = mongoose.createConnection(configDB);
autoIncrement.initialize(connection);

var postSchema = new mongoose.Schema({
    PostTitle   : { type: String, default: '' },
    PostContent : { type: String, default: '' },
    DateCreated : { type: Date, default: Date.now() },
    CreatedBy   : { type: String, default: '' }
});

postSchema.statics.addPost = function (title, content, username, callback) {
    var newPost = new this();
    newPost.PostTitle = title;
    newPost.PostContent = content;
    newPost.CreatedBy = username;
    newPost.save(function (err) {
        if (err) {
            return callback(err);
        } else {
            return callback(null, 201);
        }
    });
};

postSchema.statics.getAllPosts = function (callback) {
   this.find({}, function (err, posts) {
       if (err) {
           return callback(err);
       } else {
           return callback(null, posts);
       }
   });
};

postSchema.plugin(autoIncrement.plugin, { model: 'Post', field: 'PostID', startAt: 1 });

module.exports = mongoose.model('Post', postSchema);