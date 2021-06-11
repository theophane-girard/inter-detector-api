'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Label', [
      {
        name: 'inter'
      },
      {
        name: 'troll'
      },
      {
        name: 'newAccount'
      },
      {
        name: 'hyperCarry'
      },
    ], {})
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
