'use strict';

const recountLikesAndDislikesForBlogPosts = require('../utils/countLikesDislikesBlog');
const recountLikesAndDislikesForComments = require('../utils/countLikesDislikesCom');
const recountLikesAndDislikesForPictures = require('../utils/countLikesDislikesPic');

class Dislike extends Parse.Object {
  constructor() {
    super('Dislike');
  }

  static async createDislike(req) {
    const { userId, pictureId, blogPostId, commentId } = req.params;

    // Fetch User
    const userQuery = new Parse.Query('_User');
    const user = await userQuery.get(userId, { useMasterKey: true });

    // Check if User exist
    if (!user) {
      throw new Error('User not found');
    }
    // Checki if nothing is provided
    if (!pictureId && !blogPostId && !commentId) {
      throw new Error('Nothng was selected');
    }

    // Check if the user has already Liked the BlogPost
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
        await like.destroy({ useMasterKey: true });

        try {
          likeQuery.equalTo('blogPost', blogPost);
          const likesCount = await likeQuery.count({ useMasterKey: true });
          blogPost.set('likes', likesCount);
          await blogPost.save(null, { useMasterKey: true });
        } catch (e) {
          throw new Error(e);
        }
      }
    }

    // Check if the user has already Liked the Picture
    if (pictureId !== undefined) {
      const likeQuery = new Parse.Query('Like');
      likeQuery.equalTo('user', user);
      const pictureQuery = new Parse.Query('Picture');
      const picture = await pictureQuery.get(pictureId, { useMasterKey: true });
      likeQuery.equalTo('picture', picture);

      const like = await likeQuery.first({ useMasterKey: true });

      if (like) {
        await like.destroy({ useMasterKey: true });

        try {
          likeQuery.equalTo('picture', picture);
          const likesCount = await likeQuery.count({ useMasterKey: true });
          picture.set('likes', likesCount);
          await picture.save(null, { useMasterKey: true });
        } catch (e) {
          throw new Error(e);
        }
      }
    }

    // Check if the user has already Liked the Comment
    if (commentId !== undefined) {
      const likeQuery = new Parse.Query('Like');
      likeQuery.equalTo('user', user);
      const commentQuery = new Parse.Query('Comment');
      const comment = await commentQuery.get(commentId, { useMasterKey: true });
      likeQuery.equalTo('comment', comment);
      const like = await likeQuery.first({ useMasterKey: true });

      if (like) {
        await like.destroy({ useMasterKey: true });
        try {
          likeQuery.equalTo('comment', comment);
          const likesCount = await likeQuery.count({ useMasterKey: true });
          comment.set('likes', likesCount);
          await comment.save(null, { useMasterKey: true });
        } catch (e) {
          throw new Error(e);
        }
      }
    }

    // Check if the user has already DISLIKED the BlogPost
    if (blogPostId !== undefined) {
      const dislikeQuery = new Parse.Query('Dislike');
      dislikeQuery.equalTo('user', user);
      const blogPostQuery = new Parse.Query('BlogPost');
      const blogPost = await blogPostQuery.get(blogPostId, {
        useMasterKey: true,
      });
      dislikeQuery.equalTo('blogPost', blogPost);

      const dislike = await dislikeQuery.first({ useMasterKey: true });

      if (dislike) {
        throw new Error('The user has already disliked the blogPost');
      }
    }

    // Check if the user has already DISLIKED the Picture
    if (pictureId !== undefined) {
      const dislikeQuery = new Parse.Query('Dislike');
      dislikeQuery.equalTo('user', user);
      const pictureQuery = new Parse.Query('Picture');
      const picture = await pictureQuery.get(pictureId, { useMasterKey: true });
      dislikeQuery.equalTo('picture', picture);

      const dislike = await dislikeQuery.first({ useMasterKey: true });

      if (dislike) {
        throw new Error('The user has already disliked the picture');
      }
    }

    // Chekc if the user has already DISLIKED the Comment
    if (commentId !== undefined) {
      const dislikeQuery = new Parse.Query('Dislike');
      dislikeQuery.equalTo('user', user);
      const commentQuery = new Parse.Query('Comment');
      const comment = await commentQuery.get(commentId, { useMasterKey: true });
      dislikeQuery.equalTo('comment', comment);

      const dislike = await dislikeQuery.first({ useMasterKey: true });

      if (dislike) {
        throw new Error('The user has already disliked the Comment');
      }
    }

    // Create dislike
    const dislike = new Dislike();
    dislike.set('user', user);

    // BlogPost disliked
    if (blogPostId !== undefined) {
      const blogPostQuery = new Parse.Query('BlogPost');
      const blogPost = await blogPostQuery.get(blogPostId, {
        useMasterKey: true,
      });
      dislike.set('blogPost', blogPost); // Dont need to specifically set toPointer.
      await dislike.save(null, { useMasterKey: true });

      try {
        await recountLikesAndDislikesForBlogPosts();
      } catch (e) {
        throw new Error(e);
      }
    }

    // Picture disliked
    if (pictureId !== undefined) {
      const pictureQuery = new Parse.Query('Picture');
      const picture = await pictureQuery.get(pictureId, { useMasterKey: true });

      dislike.set('picture', picture);
      await dislike.save(null, { useMasterKey: true });

      try {
        await recountLikesAndDislikesForPictures();
      } catch (e) {
        throw new Error(e);
      }
    }

    // Comment disliked
    if (commentId !== undefined) {
      const commentQuery = new Parse.Query('Comment');
      const comment = await commentQuery.get(commentId, { useMasterKey: true });

      dislike.set('comment', comment);
      await dislike.save(null, { useMasterKey: true });

      try {
        await recountLikesAndDislikesForComments();
      } catch (e) {
        throw new Error(e);
      }
    }
  }

  static async removeDislike(req) {
    const { dislikeId } = req.params;
    {
      try {
        const dislikeQuery = new Parse.Query('Dislike');
        const dislike = await dislikeQuery.get(dislikeId, {
          useMasterKey: true,
        });

        const blogPost = dislike.get('blogPost');
        const comment = dislike.get('comment');
        const picture = dislike.get('picture');

        await dislike.destroy({ useMasterKey: true });

        if (blogPost !== undefined) {
          const blogPostQuery = new Parse.Query('BlogPost');
          const blogPostObject = await blogPostQuery.get(blogPost.id, {
            useMasterKey: true,
          });

          blogPostObject.set('dislikes', blogPostObject.get('dislikes') - 1);
          await blogPostObject.save(null, { useMasterKey: true });
        } else if (comment !== undefined) {
          const commentQuery = new Parse.Query('Comment');
          const commentObject = await commentQuery.get(comment.id, {
            useMasterKey: true,
          });

          commentObject.set('dislikes', commentObject.get('dislikes') - 1);
          await commentObject.save(null, { useMasterKey: true });
        } else if (picture !== undefined) {
          const pictureQuery = new Parse.Query('Picture');
          const pictureObject = await pictureQuery.get(picture.id, {
            useMasterKey: true,
          });

          pictureObject.set('dislikes', pictureObject.get('dislikes') - 1);
          await pictureObject.save(null, { useMasterKey: true });
        } else {
          throw new Error('Couldnt find dislike');
        }
      } catch (e) {
        throw new Error(e);
      }
    }
  }

  static registerClass() {
    Parse.Object.registerSubclass('Dislike', Dislike);
  }
}

module.exports = Dislike;
