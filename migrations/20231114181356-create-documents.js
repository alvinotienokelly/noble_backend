'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('documents', {
      document_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      deal_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'deals',
          key: 'deal_id',
        },
      },
      folder_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'folders',
          key: 'folder_id',
        },
      },
      uploaded_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      file_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      file_path: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      file_type: {
        type: Sequelize.ENUM,
        values: ['pdf', 'docx', 'xlsx'],
        allowNull: true,
      },
      version_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      upload_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      access_permissions: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      watermark_details: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      docusign_envelope_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      requires_signature: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('documents');
  }
};
