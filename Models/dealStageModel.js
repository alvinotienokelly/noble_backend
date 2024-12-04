// Models/dealStageModel.js
module.exports = (sequelize, DataTypes) => {
  const DealStage = sequelize.define(
    "deal_stage",
    {
      stage_id: {
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { timestamps: true }
  );

  DealStage.associate = (models) => {
    DealStage.belongsTo(models.users, { foreignKey: "user_id", as: "user" });
  };

  return DealStage;
};