'use strict';

class Picture extends Parse.Object {
  constructor() {
    super('Picture');
  }

  static async uploadPicture(req) {
    const { postId, data } = req.params;

    const blogPostQuery = new Parse.Query('BlogPost');
    const blogPost = await blogPostQuery.get(postId, { useMasterKey: true });

    if (!blogPost) {
      return;
    }

    const file = new Parse.File('picture.jpg', { base64: data });

    const picture = new Picture();
    picture.set('picture', file);
    picture.set('blogPost', blogPost);
    picture.set('likes', 0);
    picture.set('dislikes', 0);

    const relation = blogPost.relation('pictures');
    const pictureCount = await relation.query().count({ useMasterKey: true });

    if (pictureCount >= 15) {
      throw new Error('Blog already has the max numbers. Please delete some');
    }

    await picture.save(null, { useMasterKey: true });

    relation.add(picture);

    try {
      await blogPost.save(null, { useMasterKey: true });
    } catch (e) {
      throw new Error(e);
    }
  }

  static async deletePicture(req) {
    const { pictureId } = req.params;

    const pictureQuery = new Parse.Query('Picture');
    const picture = await pictureQuery.get(pictureId, { useMasterKey: true });

    // Fetch all the likes associated with the picture
    const likeQuery = new Parse.Query('Like');
    likeQuery.equalTo('picture', picture);
    const likes = await likeQuery.find({ useMasterKey: true });

    // Fetch all the dislikes associated with the picture
    const dislikeQuery = new Parse.Query('Dislike');
    dislikeQuery.equalTo('picture', picture);
    const dislikes = await dislikeQuery.find({ useMasterKey: true });

    await Parse.Object.destroyAll([...likes, ...dislikes], {
      useMasterKey: true,
    });

    // Fetch all the comments associated with the picture
    const commentsQuery = new Parse.Query('Comment');
    commentsQuery.equalTo('picture', picture);
    const comments = await commentsQuery.find({ useMasterKey: true });

    // Fetch all the likes associated with the comments
    const commentsLikesQuery = new Parse.Query('Like');
    commentsLikesQuery.containedIn('comment', comments);
    const commentsLikes = await commentsLikesQuery.find({ useMasterKey: true });

    // Fetch all the dislikes associated with the comments
    const commentsDislikesQuery = new Parse.Query('Dislike');
    commentsDislikesQuery.containedIn('comment', comments);
    const commentsDislikes = await commentsDislikesQuery.find({
      useMasterKey: true,
    });

    await Parse.Object.destroyAll([...commentsLikes, ...commentsDislikes], {
      useMasterKey: true,
    });

    await Parse.Object.destroyAll(comments, { useMasterKey: true });

    try {
      await picture.destroy({ useMasterKey: true });
    } catch (e) {
      throw new Error(e);
    }
  }

  static registerClass() {
    Parse.Object.registerSubclass('Picture', Picture);
  }
}

module.exports = Picture;
