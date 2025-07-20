const { onCall } = require("firebase-functions/v2/https");
const userService = require("./userService");

exports.createUser = onCall(async (request) => {
  try {
    const userData = request.data;
    const result = await userService.createUser(userData);
    return result;
  } catch (error) {
    throw new Error(error.message || "Failed to create user.");
  }
});

exports.getUser = onCall(async (request) => {
  try {
    const { userId } = request.data;
    const result = await userService.getUser(userId);
    return result;
  } catch (error) {
    throw new Error(error.message || "Failed to get user.");
  }
});

exports.updateUser = onCall(async (request) => {
  try {
    const { userId, updates } = request.data;
    const result = await userService.updateUser(userId, updates);
    return result;
  } catch (error) {
    throw new Error(error.message || "Failed to update user.");
  }
});

exports.deleteUser = onCall(async (request) => {
  try {
    const { userId } = request.data;
    const result = await userService.deleteUser(userId);
    return result;
  } catch (error) {
    throw new Error(error.message || "Failed to delete user.");
  }
});
