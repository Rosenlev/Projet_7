'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Comment.belongsTo(models.User, {
        foreignKey: {
          allowNull:false
        }
      })

      models.Post.belongsTo(models.Post, {
        foreignKey: {
          allowNull:false
        }
      })
    }
  };
  comment.init({
    idUsers: DataTypes.INTEGER,
    idPosts: DataTypes.INTEGER,
    avatar: DataTypes.STRING,
    username: DataTypes.STRING,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'comment',
  });
  return comment;
};