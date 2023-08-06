'use strict';

const {
  validateTitle,
  validateDescription,
  validateLocation,
} = require('../utils/validatorBlogPost');

class BlogPost extends Parse.Object {
  constructor() {
    super('BlogPost');
  }

  static async createBlogPost(req) {
    const { userId, title, description, location } = req.params;

    // Validate the "title" field
    validateTitle(title);
    // Validate the "description" field
    validateDescription(description);
    // Validate the "location" field
    validateLocation(location);

    const blogPost = new BlogPost();

    blogPost.set('title', title);
    blogPost.set('description', description);
    blogPost.set('location', location);
    blogPost.set('likes', 0);
    blogPost.set('dislikes', 0);

    blogPost.set('user', {
      __type: 'Pointer',
      className: '_User',
      objectId: userId,
    }); //  This will work. OR Query for user and just set ('user', user)

    try {
      await blogPost.save(null, { useMasterKey: true });
    } catch (e) {
      throw new Error(e);
    }
  }

  static async updateBlogPost(req) {
    const { postId, title, description, location } = req.params;

    if (!postId) {
      throw new Error('postId is required.');
    }

    const blogPostQuery = new Parse.Query('BlogPost');
    const blogPost = await blogPostQuery.get(postId, { useMasterKey: true });

    if (title !== undefined) {
      validateTitle(title);
      blogPost.set('title', title);
    }

    if (description !== undefined) {
      validateDescription(description);
      blogPost.set('description', description);
    }

    if (location !== undefined) {
      validateLocation(location);
      blogPost.set('location', location);
    }

    try {
      await blogPost.save(null, { useMasterKey: true });
    } catch (e) {
      throw new Error(e);
    }
  }

  static async deleteBlogPost(req) {
    const { postId } = req.params;

    const blogQuery = new Parse.Query('BlogPost');
    const blogPost = await blogQuery.get(postId, { useMasterKey: true });

    // Delete all Likes associated with the BlogPost
    const blogPostLikesQuery = new Parse.Query('Like');
    blogPostLikesQuery.equalTo('blogPost', blogPost);
    const blogPostLikes = await blogPostLikesQuery.find({ useMasterKey: true });
    await Parse.Object.destroyAll(blogPostLikes, { useMasterKey: true });

    // Delete all Dislikes associated with the BlogPost
    const blogPostDislikesQuery = new Parse.Query('Dislike');
    blogPostDislikesQuery.equalTo('blogPost', blogPost);
    const blogPostDislikes = await blogPostDislikesQuery.find({
      useMasterKey: true,
    });
    await Parse.Object.destroyAll(blogPostDislikes, { useMasterKey: true });

    // Delete all Pictures associated with the BlogPost
    const picturesQuery = new Parse.Query('Picture');
    picturesQuery.equalTo('blogPost', blogPost);
    const pictures = await picturesQuery.find({ useMasterKey: true });

    // Delete all Likes/Dislikes associated with the Picture
    const picturesLikesQuery = new Parse.Query('Like');
    picturesLikesQuery.containedIn('picture', pictures);
    const picturesLikes = await picturesLikesQuery.find({ useMasterKey: true });
    await Parse.Object.destroyAll(picturesLikes, { useMasterKey: true });

    const picturesDislikesQuery = new Parse.Query('Dislike');
    picturesDislikesQuery.containedIn('picture', pictures);
    const picturesDislikes = await picturesDislikesQuery.find({
      useMasterKey: true,
    });
    await Parse.Object.destroyAll(picturesDislikes, { useMasterKey: true });

    // Delete all Comments associated with the Pictures
    const pictureCommentsQuery = new Parse.Query('Comment');
    pictureCommentsQuery.containedIn('picture', pictures);
    const pictureComments = await pictureCommentsQuery.find({
      useMasterKey: true,
    });

    await Parse.Object.destroyAll(pictureComments, { useMasterKey: true });

    // Delete all Likes/Dislikes associated with the PictureComments
    const pictureCommentsLikesQuery = new Parse.Query('Like');
    pictureCommentsLikesQuery.containedIn('comment', pictureComments);
    const pictureCommentLikes = await pictureCommentsLikesQuery.find({
      useMasterKey: true,
    });

    await Parse.Object.destroyAll(pictureCommentLikes, { useMasterKey: true });

    const pictureCommentDislikesQuery = new Parse.Query('Dislike');
    pictureCommentDislikesQuery.containedIn('comment', pictureComments);
    const pictureCommentDislikes = await pictureCommentDislikesQuery.find({
      useMasterKey: true,
    });

    await Parse.Object.destroyAll(pictureCommentDislikes, {
      useMasterKey: true,
    });

    // Fetch all Comments associated with the BlogPost
    const commentQuery = new Parse.Query('Comment');
    commentQuery.equalTo('blogPost', blogPost);
    const comments = await commentQuery.find({ useMasterKey: true });

    // Delete All Likes/Dislikes associated with the Comments
    const commentsLikesQuery = new Parse.Query('Like');
    commentsLikesQuery.containedIn('comment', comments);
    const commentsLikes = await commentsLikesQuery.find({ useMasterKey: true });
    await Parse.Object.destroyAll(commentsLikes, { useMasterKey: true });

    const commentsDislikesQuery = new Parse.Query('Dislike');
    commentsDislikesQuery.containedIn('comment', comments);
    const commentsDislikes = await commentsDislikesQuery.find({
      useMasterKey: true,
    });
    await Parse.Object.destroyAll(commentsDislikes, { useMasterKey: true });

    await Parse.Object.destroyAll([...pictures, ...comments], {
      useMasterKey: true,
    });

    try {
      await blogPost.destroy({ useMasterKey: true });
    } catch (e) {
      throw new Error(e);
    }
  }

  static registerClass() {
    Parse.Object.registerSubclass('BlogPost', BlogPost);
  }
}

module.exports = BlogPost;
