'use strict';

const validateContent = require('../utils/validatorComment');

class Comment extends Parse.Object {
  constructor() {
    super('Comment');
  }

  static async createComment(req) {
    const { userId, postId, picId, content } = req.params;

    if (!picId && !postId) {
      return 'Please choose picture or blog post';
    }

    if (content !== undefined) {
      try {
        validateContent(content);
      } catch (e) {
        throw new Error(e.message);
      }
    }

    const userQuery = new Parse.Query('_User');
    const user = await userQuery.get(userId, { useMasterKey: true });

    if (postId) {
      const postQuery = new Parse.Query('BlogPost');
      const post = await postQuery.get(postId, { useMasterKey: true });

      const comment = new Comment();
      comment.set('user', user);
      comment.set('blogPost', post);
      comment.set('content', content);
      comment.set('likes', 0);
      comment.set('dislikes', 0);

      const relation = post.relation('comments');

      await comment.save(null, { useMasterKey: true });
      relation.add(comment);

      try {
        await post.save(null, { useMasterKey: true });
      } catch (e) {
        throw new Error(e);
      }
    }

    if (picId) {
      const picQuery = new Parse.Query('Picture');
      const picture = await picQuery.get(picId, { useMasterKey: true });

      const comment = new Comment();
      comment.set('user', user);
      comment.set('picture', picture);
      comment.set('content', content);
      comment.set('likes', 0);
      comment.set('dislikes', 0);

      const relation = picture.relation('comments');

      await comment.save(null, { useMasterKey: true });
      relation.add(comment);

      try {
        await picture.save(null, { useMasterKey: true });
      } catch (e) {
        throw new Error(e);
      }
    }
  }

  static async deleteComment(req) {
    const { commentId } = req.params;

    const commentQuery = new Parse.Query('Comment');
    const comment = await commentQuery.get(commentId, { useMasterKey: true });

    try {
      const likeQuery = new Parse.Query('Like');
      likeQuery.equalTo('comment', comment); 
      const likes = await likeQuery.find({ useMasterKey: true });
      await Parse.Object.destroyAll(likes, { useMasterKey: true });

      const dislikeQuery = new Parse.Query('Dislike');
      dislikeQuery.equalTo('comment', comment); 
      const dislikes = await dislikeQuery.find({ useMasterKey: true });
      await Parse.Object.destroyAll(dislikes, { useMasterKey: true });

      await comment.destroy({ useMasterKey: true });
    } catch (e) {
      throw new Error(e);
    }
  }

  static async editComment(req) {
    const { commentId, content } = req.params;

    if (content !== undefined) {
      try {
        validateContent(content);
      } catch (e) {
        throw new Error(e.message);
      }
    }

    const commentQuery = new Parse.Query('Comment');
    const comment = await commentQuery.get(commentId, { useMasterKey: true });

    if (!comment) {
      return;
    }

    comment.set('content', content);

    try {
      await comment.save(null, { useMasterKey: true });
    } catch (e) {
      throw new Error(e);
    }
  }

  static registerClass() {
    Parse.Object.registerSubclass('Comment', Comment);
  }
}

module.exports = Comment;
