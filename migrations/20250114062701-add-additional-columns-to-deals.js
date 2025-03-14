'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.addColumn('deals', 'has_information_memorandum', {
    //   type: Sequelize.ENUM,
    //   values: ["Yes", "No"],
    //   allowNull: true,
    // });

    // await queryInterface.addColumn('deals', 'has_vdr', {
    //   type: Sequelize.ENUM,
    //   values: ["Yes", "No"],
    //   allowNull: true,
    // });

    // await queryInterface.addColumn('deals', 'consultant_name', {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('deals', 'has_information_memorandum');
    await queryInterface.removeColumn('deals', 'has_vdr');
    await queryInterface.removeColumn('deals', 'consultant_name');
  },
};
