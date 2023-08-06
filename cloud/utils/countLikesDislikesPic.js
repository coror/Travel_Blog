'use strict'

const recountLikesAndDislikesForPictures = async () => {
  const picturesQuery = new Parse.Query('Picture');
  const pictures = await picturesQuery.find({ useMasterKey: true });

  pictures.forEach(async (picture) => {
    // Count Likes for the Picture
    const likesQuery = new Parse.Query('Like');
    likesQuery.equalTo('picture', picture);
    const likesCount = await likesQuery.count({ useMasterKey: true });

    // Count Dislikes for the Picture
    const dislikesQuery = new Parse.Query('Dislike');
    dislikesQuery.equalTo('picture', picture);
    const dislikesCount = await dislikesQuery.count({
      useMasterKey: true,
    });

    // Update Picture's like and dislike count fields
    picture.set('likes', likesCount);
    picture.set('dislikes', dislikesCount);

    // Save the updated Picture object
    await picture.save(null, { useMasterKey: true });
  });
};

module.exports = recountLikesAndDislikesForPictures