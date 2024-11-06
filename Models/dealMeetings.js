// Models/dealMeetingModel.js
module.exports = (sequelize, DataTypes) => {
  const DealMeeting = sequelize.define(
    "deal_meeting",
    {
      meeting_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      deal_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "deals", // name of the target table
          key: "deal_id", // key in the target table
        },
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      start: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      attendees: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      meeting_link: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  return DealMeeting;
};