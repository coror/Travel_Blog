"use strict";

const validateTitle = (title) => {
  if ((!title && title.trim().length === 0) || title.length >= 50) {
    throw new Error(
      "Title cannot be empty and must be less than 50 characters."
    );
  }
};

const validateDescription = (description) => {
  if (description !== undefined && description.length >= 500) {
    throw new Error("Description must be less than 500 characters.");
  }
};

const validateLocation = (location) => {
  if (!location || location.trim().length <= 1 || location.length >= 100) {
    throw new Error(
      "Location must be longer than 1 character and less than 100 characters."
    );
  }
};

module.exports = {
  validateTitle,
  validateDescription,
  validateLocation,
};
