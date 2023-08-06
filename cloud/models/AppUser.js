'use strict';

const recountLikesAndDislikesForBlogPosts = require('../utils/countLikesDislikesBlog');
const recountLikesAndDislikesForPictures = require('../utils/countLikesDislikesPic');
const recountLikesAndDislikesForComments = require('../utils/countLikesDislikesCom');

const {
  validateFullName,
  validateEmail,
  validatePassword,
  validateCountry,
  validateBio,
  validateTravelInterests,
  validateSocialMediaLinks,
} = require('../utils/validatorUser');

class AppUser extends Parse.User {
  constructor(att) {
    super(att);
  }

  static async createUser(req) {
    const {
      fullName,
      email,
      password,
      bio,
      travelInterests,
      country,
      socialMediaLinks,
    } = req.params;

    const userData = {
      fullName,
      email,
      username: email,
      password,
      bio,
      travelInterests,
      country,
      socialMediaLinks,
    };

    try {
      validateFullName(fullName);
      validateEmail(email);
      validatePassword(password);
      validateCountry(country);
      validateBio(bio);
      validateSocialMediaLinks(socialMediaLinks);
      validateTravelInterests(travelInterests);

      const user = new AppUser(userData);
      await user.signUp();
    } catch (e) {
      throw new Error(e);
    }
  }

  static async beforeSave(req) {
    const fullName = req.object.get('fullName');
    const formattedFullName = fullName
      .trim()
      .split(' ')
      .map((a) => a[0].toUpperCase() + a.slice(1))
      .join(' ');

    req.object.set('fullName', formattedFullName);
  }

  static async updateUser(req) {
    const { userId, password, bio, travelInterests, socialMediaLinks } =
      req.params;

    const userQuery = new Parse.Query('_User');
    const user = await userQuery.get(userId, { useMasterKey: true });

    if (password !== undefined) {
      try {
        validatePassword(password);
      } catch (e) {
        throw new Error(e.message); // Re-throw the error message
      }
      user.set('password', password);
    }

    if (bio) {
      validateBio(bio);
      user.set('bio', bio);
    }

    if (travelInterests) {
      validateTravelInterests(travelInterests);
      user.set('travelInterests', travelInterests);
    }

    if (socialMediaLinks) {
      validateSocialMediaLinks(socialMediaLinks);
      user.set('socialMediaLinks', socialMediaLinks);
    }

    try {
      await user.save(null, { useMasterKey: true });
    } catch (e) {
      throw new Error(e);
    }
  }

  static async deleteUser(req) {
    const { userId } = req.params;

    const userQuery = new Parse.Query('_User');
    const user = await userQuery.get(userId, { useMasterKey: true });
    const avatar = user.get('avatar');

    if (avatar) {
      await avatar.destroy({ useMasterKey: true });
    }

    // Delete all BlogPosts associated with the user
    const blogPostQuery = new Parse.Query('BlogPost');
    blogPostQuery.equalTo('user', user);
    const blogPosts = await blogPostQuery.find({ useMasterKey: true });

    await Parse.Object.destroyAll(blogPosts, { useMasterKey: true });

    // --> Delete all likes/dislikes associated with the BlogPost
    const blogPostLikesQuery = new Parse.Query('Like');
    blogPostLikesQuery.containedIn('blogPost', blogPosts);
    const blogPostLikes = await blogPostLikesQuery.find({ useMasterKey: true });

    await Parse.Object.destroyAll(blogPostLikes, { useMasterKey: true });

    const blogPostDislikesQuery = new Parse.Query('Dislike');
    blogPostDislikesQuery.containedIn('blogPost', blogPosts);
    const blogPostDislikes = await blogPostDislikesQuery.find({
      useMasterKey: true,
    });

    await Parse.Object.destroyAll(blogPostDislikes, { useMasterKey: true });

    // --> Delete all Comments associated with the BlogPost
    const blogPostCommentsQuery = new Parse.Query('Comment');
    blogPostCommentsQuery.containedIn('blogPost', blogPosts);
    const blogPostComments = await blogPostCommentsQuery.find({
      useMasterKey: true,
    });

    // --> --> Delete all Likes associated with the Comments associated with the BlogPost
    const blogPostCommentsLikesQuery = new Parse.Query('Like');
    blogPostCommentsLikesQuery.containedIn('comment', blogPostComments);
    const blogPostCommentsLikes = await blogPostCommentsLikesQuery.find({
      useMasterKey: true,
    });

    await Parse.Object.destroyAll(blogPostCommentsLikes, {
      useMasterKey: true,
    });

    // --> --> Delete all Dislikes associated with the Comments associated with the BlogPost
    const blogPostCommentsDislikesQuery = new Parse.Query('Dislike');
    blogPostCommentsDislikesQuery.containedIn('comment', blogPostComments);
    const blogPostCommentsDislikes = await blogPostCommentsDislikesQuery.find({
      useMasterKey: true,
    });

    await Parse.Object.destroyAll(blogPostCommentsDislikes, {
      useMasterKey: true,
    });

    await Parse.Object.destroyAll(blogPostComments, { useMasterKey: true });

    // --> Delete all Pictures associated with the BlogPost
    const blogPostPicturesQuery = new Parse.Query('Picture');
    blogPostPicturesQuery.containedIn('blogPost', blogPosts);
    const blogPostPictures = await blogPostPicturesQuery.find({
      useMasterKey: true,
    });

    await Parse.Object.destroyAll(blogPostPictures, { useMasterKey: true });

    // --> --> Delete all Comments associated with the Picture
    const pictureCommentsQuery = new Parse.Query('Comment');
    pictureCommentsQuery.containedIn('picture', blogPostPictures);
    const pictureComments = await pictureCommentsQuery.find({
      useMasterKey: true,
    });

    // --> --> --> Delete all Likes associated with those comments
    const pictureCommentsLikesQuery = new Parse.Query('Like');
    pictureCommentsLikesQuery.containedIn('comment', pictureComments);
    const pictureCommentsLikes = await pictureCommentsLikesQuery.find({
      useMasterKey: true,
    });

    await Parse.Object.destroyAll(pictureCommentsLikes, { useMasterKey: true });

    // --> --> --> Delete all Disikes associated with those comments
    const pictureCommentsDislikesQuery = new Parse.Query('Dislike');
    pictureCommentsDislikesQuery.containedIn('comment', pictureComments);
    const pictureCommentsDislikes = await pictureCommentsDislikesQuery.find({
      useMasterKey: true,
    });

    await Parse.Object.destroyAll(pictureCommentsDislikes, {
      useMasterKey: true,
    });

    await Parse.Object.destroyAll(pictureComments, { useMasterKey: true });

    // --> --> Delete all Likes associated with the Pictures associated with the BlogPost
    const blogPostPictureLikesQuery = new Parse.Query('Like');
    blogPostPictureLikesQuery.containedIn('picture', blogPostPictures);
    const blogPostPicturesLikes = await blogPostPictureLikesQuery.find({
      useMasterKey: true,
    });

    await Parse.Object.destroyAll(blogPostPicturesLikes, {
      useMasterKey: true,
    });

    // --> --> Delete all Dislikes associated with the Pictures associated with the BlogPost
    const blogPostPictureDislikesQuery = new Parse.Query('Dislike');
    blogPostPictureDislikesQuery.containedIn('picture', blogPostPictures);
    const blogPostPicturesDislikes = await blogPostPictureDislikesQuery.find({
      useMasterKey: true,
    });

    await Parse.Object.destroyAll(blogPostPicturesDislikes, {
      useMasterKey: true,
    });

    // Delete all Comments associated with the user
    const commentQuery = new Parse.Query('Comment');
    commentQuery.equalTo('user', user);
    const comments = await commentQuery.find({ useMasterKey: true });

    // --> Delete all Likes associated with the Comments
    const commentsLikesQuery = new Parse.Query('Like');
    commentsLikesQuery.containedIn('comment', comments);
    const commentsLikes = await commentsLikesQuery.find({ useMasterKey: true });

    await Parse.Object.destroyAll(commentsLikes, { useMasterKey: true });

    // --> Delete all Dislikes associated with the Comments
    const commentsDislikesQuery = new Parse.Query('Dislike');
    commentsDislikesQuery.containedIn('comment', comments);
    const commentsDislikes = await commentsDislikesQuery.find({
      useMasterKey: true,
    });

    await Parse.Object.destroyAll(commentsDislikes, { useMasterKey: true });

    await Parse.Object.destroyAll(comments, { useMasterKey: true });

    // Delete all Likes associated with the user
    const likeQuery = new Parse.Query('Like');
    likeQuery.equalTo('user', user);
    const likes = await likeQuery.find({ useMasterKey: true });

    await Parse.Object.destroyAll(likes, { useMasterKey: true });

    // Delete all Dislikes associated with the user
    const dislikeQuery = new Parse.Query('Dislike');
    dislikeQuery.equalTo('user', user);
    const dislikes = await dislikeQuery.find({ useMasterKey: true });

    await Parse.Object.destroyAll(dislikes, { useMasterKey: true });

    try {
      await user.destroy({ useMasterKey: true });
      await recountLikesAndDislikesForPictures();
      await recountLikesAndDislikesForComments();
      await recountLikesAndDislikesForBlogPosts();
    } catch (e) {
      throw new Error(e);
    }
  }

  static registerClass() {
    Parse.Object.registerSubclass('_User', AppUser);
  }
}

module.exports = AppUser;
