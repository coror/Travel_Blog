"use strict";

const validateContent = (content) => {
  if (content.trim().length < 1) {
    throw new Error("Content cannot be an empty string.");
  }
};

module.exports = validateContent;
