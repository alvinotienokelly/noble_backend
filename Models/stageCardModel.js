// Models/stageCardModel.js
module.exports = (sequelize, DataTypes) => {
  const StageCard = sequelize.define(
    "stage_card",
    {
      card_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      pipeline_stage_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "pipeline_stages",
          key: "stage_id",
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    { timestamps: true }
  );

  return StageCard;
};