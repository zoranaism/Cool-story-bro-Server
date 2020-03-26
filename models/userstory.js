'use strict';
module.exports = (sequelize, DataTypes) => {
  const userStory = sequelize.define('userStory', {
    userId: DataTypes.INTEGER,
    storyId: DataTypes.INTEGER
  }, {});
  userStory.associate = function(models) {
    userStory.belongsTo(models.user);
    userStory.belongsTo(models.story);
  };
  return userStory;
};