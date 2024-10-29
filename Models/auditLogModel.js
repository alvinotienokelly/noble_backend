// Models/auditLogModel.js
module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define(
    "audit_log",
    {
      log_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ip_address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      geo_location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );

  return AuditLog;
};
