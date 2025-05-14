'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE User 
      ADD COLUMN profile VARCHAR(255) NULL AFTER password;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('User', 'profile');
  }
};
