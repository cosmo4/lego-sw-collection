const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getUserCollection = () => mongodb.getDb().db().collection('user');

const findUserByEmail = async (email) => {
  const user = await getUserCollection().findOne({ email: email });
  return user;
};

const createUser = async (userInfo) => {
  const result = await getUserCollection().insertOne(userInfo);
  return result;
};

module.exports = {
  findUserByEmail,
  createUser
};
