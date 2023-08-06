'use strict';

const AppUser = require('./models/AppUser');
const Avatar = require('./models/Avatar');
const BlogPost = require('./models/BlogPost');
const Picture = require('./models/Picture');
const Comment = require('./models/Comment');
const Like = require('./models/Like');
const Dislike = require('./models/Dislike');

// User
Parse.Cloud.define('createUser', AppUser.createUser);

Parse.Cloud.beforeSave(AppUser, AppUser.beforeSave);

Parse.Cloud.define('updateUser', AppUser.updateUser);

Parse.Cloud.define('deleteUser', AppUser.deleteUser);

// Avatar
Parse.Cloud.define('uploadAvatar', Avatar.uploadAvatar);

Parse.Cloud.define('deleteAvatar', Avatar.deleteAvatar);

// Post
Parse.Cloud.define('createBlogPost', BlogPost.createBlogPost);

Parse.Cloud.define('updateBlogPost', BlogPost.updateBlogPost);

Parse.Cloud.define('deleteBlogPost', BlogPost.deleteBlogPost);

// Picture
Parse.Cloud.define('uploadPicture', Picture.uploadPicture);

Parse.Cloud.define('deletePicture', Picture.deletePicture);

// Comment
Parse.Cloud.define('createComment', Comment.createComment);

Parse.Cloud.define('deleteComment', Comment.deleteComment);

Parse.Cloud.define('editComment', Comment.editComment);

// Like
Parse.Cloud.define('createLike', Like.createLike);

Parse.Cloud.define('removeLike', Like.removeLike);

// Dislike
Parse.Cloud.define('createDislike', Dislike.createDislike);

Parse.Cloud.define('removeDislike', Dislike.removeDislike);
