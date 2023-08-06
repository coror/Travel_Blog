"use strict";

const sharp = require("sharp");

class Avatar extends Parse.Object {
  constructor() {
    super("Avatar");
  }

  static async uploadAvatar(req) {
    const { userId, data } = req.params;

    const userQuery = new Parse.Query("_User");
    const user = await userQuery.get(userId, { useMasterKey: true });

    if (!user) {
      return;
    }

    const existingAvatar = user.get("avatar");

    if (existingAvatar) {
      try {
        await existingAvatar.destroy({ useMasterKey: true });
      } catch (e) {
        throw new Error(e);
      }
    }

    const resizedAvatar = await sharp(Buffer.from(data, "base64"))
      .resize(320, 420)
      .toBuffer();
    const resizedFile = new Parse.File("resized-photo.jpg", {
      base64: resizedAvatar.toString("base64"),
    });

    const avatar = new Avatar();
    avatar.set("avatar", resizedFile);
    avatar.set("user", user); // check BlogPost.js comments
    // user.set("avatar", resizedFile);

    await avatar.save(null, { useMasterKey: true });
    user.set("avatar", avatar);

    try {
      await user.save(null, { useMasterKey: true });
    } catch (e) {
      throw new Error(e);
    }
  }

  static async deleteAvatar(req) {
    const { avatarId } = req.params;

    const avatarQuery = new Parse.Query("Avatar");
    const avatar = await avatarQuery.get(avatarId, { useMasterKey: true });

    const userId = avatar.get("user").id; // get the users objectId directly

    const userQuery = new Parse.Query("_User");
    const user = await userQuery.get(userId, { useMasterKey: true });

    user.unset("avatar"); // delete a certain property of the object

    await user.save(null, { useMasterKey: true });

    try {
      await avatar.destroy({ useMasterKey: true });
    } catch (e) {
      throw new Error(e);
    }
  }

  static async registerClass() {
    Parse.Object.registerSubclass("Avatar", Avatar);
  }
}

module.exports = Avatar;
