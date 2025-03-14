'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.addColumn('deals', 'teaser', {
    //   type: Sequelize.ENUM,
    //   values: ["Yes", "No"],
    //   allowNull: false,
    //   defaultValue: "Yes",
    // });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('deals', 'teaser');
  },
};
