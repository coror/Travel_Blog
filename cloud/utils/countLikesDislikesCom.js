'use strict';

const recountLikesAndDislikesForComments = async () => {
  const commentsQuery = new Parse.Query('Comment');
  const comments = await commentsQuery.find({ useMasterKey: true });

  comments.forEach(async (comment) => {
    // Count Likes for the Comment
    const likesQuery = new Parse.Query('Like');
    likesQuery.equalTo('comment', comment);
    const likesCount = await likesQuery.count({ useMasterKey: true });

    // Count Dislikes for the Comment
    const dislikesQuery = new Parse.Query('Dislike');
    dislikesQuery.equalTo('comment', comment);
    const dislikesCount = await dislikesQuery.count({
      useMasterKey: true,
    });

    comment.set('likes', likesCount);
    comment.set('dislikes', dislikesCount);

    // Save the updated Comment object
    await comment.save(null, { useMasterKey: true });
  });
};



module.exports = recountLikesAndDislikesForComments