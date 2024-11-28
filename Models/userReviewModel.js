// Models/userReviewModel.js
module.exports = (sequelize, DataTypes) => {
  const UserReview = sequelize.define(
    "user_review",
    {
      review_id: {
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
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      review_note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      relationship: {
        type: DataTypes.ENUM,
        values: ["I contacted them",
            "I previously worked with them",
             "I received a term sheet",
             "I heard about them anecdotally", 
             "They invested in my company",
             "He/She is a personal friend",
             "I got into diliogence with them",
              "I pitched them"],
        allowNull: false,
      },
    },
    { timestamps: true }
  );

  return UserReview;
};