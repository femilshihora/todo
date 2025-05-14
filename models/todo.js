'use strict';
module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define('Todo', {
    // Define your attributes
    title:{
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
    },
    description:{
    type: DataTypes.STRING,
    allowNull: true,
    },
    userId: DataTypes.INTEGER,
  });

  Todo.associate = (models) => {
    Todo.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Todo;
};
