'use strict';

const recountLikesAndDislikesForBlogPosts = require('../utils/countLikesDislikesBlog');
const recountLikesAndDislikesForComments = require('../utils/countLikesDislikesCom');
const recountLikesAndDislikesForPictures = require('../utils/countLikesDislikesPic');

class Like extends Parse.Object {
  constructor() {
    super('Like');
  }

  static async createLike(req) {
    const { userId, blogPostId, commentId, pictureId } = req.params;

    // Query for user
    const userQuery = new Parse.Query('_User');
    const user = await userQuery.get(userId, { useMasterKey: true });

    // Check if nothing is provided
    if (!blogPostId && !commentId && !pictureId) {
      throw new Error('error');
    }

    // Check if it couldnt find user
    if (!user) {
      throw new Error('error');
    }

    // Check if the user has already Disliked the blogPost
    if (blogPostId !== undefined) {
      // Query for dislike
      const dislikeQuery = new Parse.Query('Dislike');
      // Check all dislike associated with THIS USER
      dislikeQuery.equalTo('user', user); // ***********************
      // Query for BlogPosts
      const blogPostQuery = new Parse.Query('BlogPost');
      // Check for THE blogpost user wants to dislike
      const blogPost = await blogPostQuery.get(blogPostId, {
        useMasterKey: true,
      });
      // of All the dislikes associated with the user, check if any matches THE blogpost user wants to like
      dislikeQuery.equalTo('blogPost', blogPost); // ************************
      // return the first match
      const dislike = await dislikeQuery.first({ useMasterKey: true });

      // if it finds it, destroy it
      if (dislike) {
        await dislike.destroy({ useMasterKey: true });

        try {
          dislikeQuery.equalTo('blogPost', blogPost);
          const dislikesCount = await dislikeQuery.count({
            useMasterKey: true,
          });
          blogPost.set('dislikes', dislikesCount);
          await blogPost.save(null, { useMasterKey: true });
        } catch (e) {
          throw new Error(e);
        }
      }
    }

    // Check if the user has already Disliked the picture
    if (pictureId !== undefined) {
      const dislikeQuery = new Parse.Query('Dislike');
      dislikeQuery.equalTo('user', user);

      const pictureQuery = new Parse.Query('Picture');
      const picture = await pictureQuery.get(pictureId, { useMasterKey: true });
      dislikeQuery.equalTo('picture', picture);
      const dislike = await dislikeQuery.first({ useMasterKey: true });

      if (dislike) {
        await dislike.destroy({ useMasterKey: true });

        try {
          dislikeQuery.equalTo('picture', picture);
          const dislikesCount = await dislikeQuery.count({
            useMasterKey: true,
          });
          picture.set('dislikes', dislikesCount);

          await picture.save(null, { useMasterKey: true });
        } catch (e) {
          throw new Error(e);
        }
      }
    }

    // Check if the user has already Disliked the comment
    if (commentId !== undefined) {
      const dislikeQuery = new Parse.Query('Dislike');
      dislikeQuery.equalTo('user', user);
      const commentQuery = new Parse.Query('Comment');
      const comment = await commentQuery.get(commentId, { useMasterKey: true });
      dislikeQuery.equalTo('comment', comment);
      const dislike = await dislikeQuery.first({ useMasterKey: true });

      if (dislike) {
        await dislike.destroy({ useMasterKey: true });

        try {
          dislikeQuery.equalTo('comment', comment);
          const dislikesCount = await dislikeQuery.count({
            useMasterKey: true,
          });
          comment.set('dislikes', dislikesCount);
          await comment.save(null, { useMasterKey: true });
        } catch (e) {
          throw new Error(e);
        }
      }
    }

    // Check if the user has already LIKED the BlogPost
    if (blogPostId !== undefined) {
      const likeQuery = new Parse.Query('Like');
      likeQuery.equalTo('user', user);
      const blogPostQuery = new Parse.Query('BlogPost');
      const blogPost = await blogPostQuery.get(blogPostId, {
        useMasterKey: true,
      });
      likeQuery.equalTo('blogPost', blogPost);
      const like = await likeQuery.first({ useMasterKey: true });

      if (like) {
        throw new Error('The user has already liked the blogPost');
      }
    }

    // Check if the user has alread LIKED the Picture
    if (pictureId !== undefined) {
      const likeQuery = new Parse.Query('Like');
      likeQuery.equalTo('user', user);
      const pictureQuery = new Parse.Query('Picture');
      const picture = await pictureQuery.get(pictureId, { useMasterKey: true });
      likeQuery.equalTo('picture', picture);
      const like = await likeQuery.first({ useMasterKey: true });

      if (like) {
        throw new Error('The user has already liked the picture');
      }
    }

    // Check if the user has already LIKED the Comment
    if (commentId !== undefined) {
      const likeQuery = new Parse.Query('Like');
      likeQuery.equalTo('user', user);
      const commentQuery = new Parse.Query('Comment');
      const comment = await commentQuery.get(commentId, { useMasterKey: true });
      likeQuery.equalTo('comment', comment);
      const like = await likeQuery.first({ useMasterKey: true });

      if (like) {
        throw new Error('The user has already liked the comment');
      }
    }

    // Create a new like
    const like = new Like();
    like.set('user', user);

    // BlogPost liked
    if (blogPostId !== undefined) {
      const blogPostQuery = new Parse.Query('BlogPost');
      const blogPost = await blogPostQuery.get(blogPostId, {
        useMasterKey: true,
      });
      like.set('blogPost', blogPost);

      await like.save(null, { useMasterKey: true });

      try {
        await recountLikesAndDislikesForBlogPosts();
      } catch (e) {
        throw new Error(e);
      }
    }

    // Comment liked
    if (commentId !== undefined) {
      const commentQuery = new Parse.Query('Comment');
      const comment = await commentQuery.get(commentId, { useMasterKey: true });
      like.set('comment', comment);

      await like.save(null, { useMasterKey: true });

      try {
        await recountLikesAndDislikesForComments();
      } catch (e) {
        throw new Error(e);
      }
    }

    // Picture liked
    if (pictureId !== undefined) {
      const pictureQuery = new Parse.Query('Picture');
      const picture = await pictureQuery.get(pictureId, { useMasterKey: true });

      like.set('picture', picture.toPointer());

      await like.save(null, { useMasterKey: true });

      try {
        await recountLikesAndDislikesForPictures();
      } catch (e) {
        throw new Error(e);
      }
    }
  }

  static async removeLike(req) {
    const { likeId } = req.params;

    try {
      const likeQuery = new Parse.Query('Like');
      const like = await likeQuery.get(likeId, { useMasterKey: true });

      const blogPost = like.get('blogPost');
      const comment = like.get('comment');
      const picture = like.get('picture');

      await like.destroy({ useMasterKey: true });

      if (blogPost !== undefined) {
        const blogPostQuery = new Parse.Query('BlogPost');
        const blogPostObject = await blogPostQuery.get(blogPost.id, {
          useMasterKey: true,
        });

        blogPostObject.set('likes', blogPostObject.get('likes') - 1);
        await blogPostObject.save(null, { useMasterKey: true });
      } else if (comment !== undefined) {
        const commentQuery = new Parse.Query('Comment');
        const commentObject = await commentQuery.get(comment.id, {
          useMasterKey: true,
        });

        commentObject.set('likes', commentObject.get('likes') - 1);
        await commentObject.save(null, { useMasterKey: true });
      } else if (picture !== undefined) {
        const pictureQuery = new Parse.Query('Picture');
        const pictureObject = await pictureQuery.get(picture.id, {
          useMasterKey: true,
        });

        pictureObject.set('likes', pictureObject.get('likes') - 1);
        await pictureObject.save(null, { useMasterKey: true });
      } else {
        throw new Error('Coulnt find like');
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  static registerClass() {
    Parse.Object.registerSubclass('Like', Like);
  }
}

module.exports = Like;
