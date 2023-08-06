'use strict';

const recountLikesAndDislikesForBlogPosts = async () => {
  const blogPostsQuery = new Parse.Query('BlogPost');
  const blogPosts = await blogPostsQuery.find({ useMasterKey: true });

  blogPosts.forEach(async (blogPost) => {
    const likesQuery = new Parse.Query('Like');
    likesQuery.equalTo('blogPost', blogPost);
    const likesCount = await likesQuery.count({ useMasterKey: true });

    const dislikesQuery = new Parse.Query('Dislike');
    dislikesQuery.equalTo('blogPost', blogPost);
    const dislikesCount = await dislikesQuery.count({
      useMasterKey: true,
    });

    blogPost.set('likes', likesCount);
    blogPost.set('dislikes', dislikesCount);

    await blogPost.save(null, { useMasterKey: true });
  });
};

module.exports = recountLikesAndDislikesForBlogPosts;