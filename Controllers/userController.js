//importing modules
const bcrypt = require("bcrypt");
const db = require("../Models");
const jwt = require("jsonwebtoken");
const { VerificationCode } = require("../Models");
const { sendVerificationCode } = require("../Middlewares/emailService");
const UserPreferences = db.user_preferences;
const UserTicketPreferences = db.user_ticket_preferences;
const DealTypePreferences = db.deal_type_preferences;
const PrimaryLocationPreferences = db.primary_location_preferences;
const Sector = db.sectors;
const ContactPerson = db.contact_persons;
const { createAuditLog } = require("./auditLogService");
const Role = db.roles;
// Assigning users to the variable User
const SectorPreference = db.sector_preferences;
const SubSector = db.subsectors;
const SubSectorPreference = db.sub_sector_preferences;
const RegionPreference = db.region_preferences;
const Region = db.regions;
const User = db.users;
const Continent = db.continents;
const ContinentPreference = db.continent_preferences;
const SocialMediaAccount = db.social_media_accounts;
const SocialAccountType = db.social_account_types;
const CountryPreference = db.country_preferences;
const Country = db.country;
const { createNotification } = require("./notificationController");
const personalEmailDomains = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "aol.com",
  "outlook.com",
  "icloud.com",
  // Add more personal email domains as needed
];

// Function to check if an email domain is personal
const isPersonalEmailDomain = (email) => {
  const domain = email.split("@")[1];
  return personalEmailDomains.includes(domain);
};

// Utility function to mask email
const maskEmail = (email) => {
  const [localPart, domain] = email.split("@");
  const maskedLocalPart =
    localPart.slice(0, 2) + "*".repeat(localPart.length - 2);
  return `${maskedLocalPart}@${domain}`;
};

//logout function
const logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1, httpOnly: true });
  return res.status(200).json({ status: true, message: "Logout successful." });
};

// Function to get users by type
const getUsersByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided

    const offset = (page - 1) * limit;

    // Find users by their type with pagination
    const { count: totalUsersCount, rows: users } = await User.findAndCountAll({
      where: {
        role: type,
      },
      offset,
      limit: parseInt(limit),
    });

    const kycStatusCounts = await User.findAll({
      attributes: [
        "kyc_status",
        [db.Sequelize.fn("COUNT", db.Sequelize.col("kyc_status")), "count"],
      ],
      group: ["kyc_status"],
    });

    const counts = {
      Verified: 0,
      Rejected: 0,
    };

    kycStatusCounts.forEach((item) => {
      counts[item.kyc_status] = parseInt(item.dataValues.count, 10);
    });

    const totalPages = Math.ceil(totalUsersCount / limit);

    if (users.length > 0) {
      return res.status(200).json({
        status: true,
        totalUsersCount,
        totalPages,
        currentPage: parseInt(page),
        activeUsersCount: counts.Verified,
        rejectedUsersCount: counts.Rejected,
        users,
      });
    } else {
      return res
        .status(200)
        .json({ status: false, message: "No users found." });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

// Update user status only
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find the user by ID
    const user = await User.findByPk(id);
    if (!user) {
      return res
        .status(200)
        .json({ status: false, message: "User not found." });
    }

    // Update the status field
    await user.update({ status });

    res.status(200).json({
      status: true,
      message: "User status updated successfully.",
      user,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

//forgot password function
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    //find a user by their email
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res
        .status(200)
        .json({ status: false, message: "User not found." });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await VerificationCode.create({ user_id: user.id, code });

    await sendVerificationCode(email, code);

    res.status(200).json({
      status: true,
      message: "Verification code sent to email." + code,
    });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

//reset password function
const resetPassword = async (req, res) => {
  try {
    const { email, code, password } = req.body;
    //find a user by their email
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res
        .status(200)
        .json({ status: false, message: "User not found." });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res
      .status(200)
      .json({ status: true, message: "Password reset successful." });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

//signing a user up
//hashing users password before its saved to the database with bcrypt
const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      role,
      role_id,
      password,
      continent_ids,
      sub_sector_ids,
      region_ids,
      country_ids,
      sector_ids,
      ticket_size_min,
      ticket_size_max,
      deal_types,
    } = req.body;
    const data = {
      name,
      email,
      role,
      role_id,
      password: await bcrypt.hash(password, 10),
    };

    // Check if the email domain is personal
    if (isPersonalEmailDomain(email)) {
      return res.status(200).json({
        status: false,
        message:
          "Personal email domains are not allowed. Please use a company email address.",
      });
    }

    // if (!Array.isArray(sub_sector_ids) || sub_sector_ids.length === 0) {
    //   return res
    //     .status(200)
    //     .json({ status: false, message: "Invalid sub-sector IDs provided." });
    // }
    // if (!Array.isArray(region_ids) || region_ids.length === 0) {
    //   return res
    //     .status(200)
    //     .json({ status: false, message: "Invalid region IDs provided." });
    // }

    // if (!Array.isArray(sector_ids) || sector_ids.length === 0) {
    //   return res
    //     .status(400)
    //     .json({ status: false, message: "Invalid sector IDs provided." });
    // }

    // if (!Array.isArray(country_ids) || country_ids.length === 0) {
    //   return res
    //     .status(200)
    //     .json({ status: false, message: "Invalid country IDs provided." });
    // }
    // if (!Array.isArray(deal_types) || deal_types.length === 0) {
    //   return res
    //     .status(400)
    //     .json({ status: false, message: "Invalid deal types provided." });
    // }

    // if (!Array.isArray(continent_ids) || continent_ids.length === 0) {
    //   return res
    //     .status(200)
    //     .json({ status: false, message: "Invalid continent IDs provided." });
    // }

    //saving the user
    const user = await User.create(data);

    //if user details is captured
    //generate token with the user's id and the secretKey in the env file
    // set cookie with the token generated
    if (user) {
      let token = jwt.sign({ id: user.id }, process.env.secretKey, {
        expiresIn: 1 * 24 * 60 * 60 * 1000,
      });

      // Create user preferences
      if (sector_ids && sector_ids.length > 0) {
        const sectorPreferences = await Promise.all(
          sector_ids.map(async (sector_id) => {
            return await SectorPreference.create({
              user_id: user.id,
              sector_id,
            });
          })
        );
      }

      if (deal_types && deal_types.length > 0) {
        const dealTypePreferences = await Promise.all(
          deal_types.map(async (deal_type) => {
            return await DealTypePreferences.create({
              user_id: user.id,
              deal_type,
            });
          })
        );
      }

      if (sub_sector_ids && sub_sector_ids.length > 0) {
        const subSectorPreferences = await Promise.all(
          sub_sector_ids.map(async (sub_sector_id) => {
            return await SubSectorPreference.create({
              user_id: user.id,
              sub_sector_id,
            });
          })
        );
      }

      if (country_ids && country_ids.length > 0) {
        const countryPreferences = await Promise.all(
          country_ids.map(async (country_id) => {
            return await CountryPreference.create({
              user_id: user.id,
              country_id,
            });
          })
        );
      }
      if (continent_ids && continent_ids.length > 0) {
        const continentPreferences = await Promise.all(
          continent_ids.map(async (continent_id) => {
            return await ContinentPreference.create({
              user_id: user.id,
              continent_id,
            });
          })
        );
      }
      if (region_ids && region_ids.length > 0) {
        const regionPreferences = await Promise.all(
          region_ids.map(async (region_id) => {
            return await RegionPreference.create({
              user_id: user.id,
              region_id,
            });
          })
        );
      }

      if (ticket_size_min && ticket_size_max) {
        const userTicketPreference = await UserTicketPreferences.create({
          user_id: user.id,
          ticket_size_min,
          ticket_size_max,
        });
      }

      res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
      console.log("user", JSON.stringify(user, null, 2));
      console.log(token);
      //send users details
      return res
        .status(200)
        .json({ status: true, message: "Registration successfull." });
    } else {
      return res.status(409).send("Details are not correct");
    }
  } catch (error) {
    console.log(error);
  }
};

const verifyCode = async (req, res) => {
  try {
    const { email, code, type } = req.body;

    // Find the user in the database
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    // Find the verification code in the database
    const verificationCode = await VerificationCode.findOne({
      where: {
        user_id: user.id,
        code: code,
        already_used: false,
      },
    });

    if (verificationCode) {
      // Mark the verification code as used
      verificationCode.already_used = true;
      await verificationCode.save();
      // Code is valid

      if (type === "forgot-password") {
        return res.status(200).json({
          status: true,
          message: "Verification successful.",
        });
      }

      let token = jwt.sign({ id: user.id }, process.env.secretKey, {
        expiresIn: 1 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        status: true,
        message: "Verification successful.",
        token: token,
        user: user,
      });
    } else {
      // Code is invalid or expired
      return res.status(200).json({
        status: false,
        message: "Invalid or expired verification code.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({ status: false, message: "Internal server error." });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] }, // Exclude the password field from the response
      include: [
        {
          model: DealTypePreferences,
          as: "dealTypePreferences",
          attributes: ["preference_id", "deal_type"],
        },

        {
          model: ContactPerson,
          as: "contactPersons",
          attributes: ["contact_id", "name", "email", "phone", "position"],
        },
        {
          model: UserTicketPreferences,
          as: "ticketPreferences",
          attributes: ["preference_id", "ticket_size_min", "ticket_size_max"],
        },
        {
          model: ContinentPreference,
          as: "continentPreferences",
          attributes: ["preference_id", "continent_id"],
          include: [
            {
              model: Continent,
              as: "continent",
              attributes: ["continent_id", "name"],
            },
          ],
        },
        {
          model: RegionPreference,
          as: "regionPreferences",
          attributes: ["preference_id", "region_id"],
          include: [
            {
              model: Region,
              as: "region",
              attributes: ["region_id", "name"],
            },
          ],
        },
        {
          model: SectorPreference,
          as: "sectorPreferences",
          attributes: ["preference_id", "sector_id"],
          include: [
            {
              model: Sector,
              as: "sector",
              attributes: ["sector_id", "name"],
            },
          ],
        },
        {
          model: SubSectorPreference,
          as: "subSectorPreferences",
          attributes: ["preference_id", "sub_sector_id"],
          include: [
            {
              model: SubSector,
              as: "subSector",
              attributes: ["subsector_id", "name"],
            },
          ],
        },
        {
          model: CountryPreference,
          as: "countryPreferences",
          attributes: ["preference_id", "country_id"],
          include: [
            {
              model: Country,
              as: "country",
              attributes: ["country_id", "name"],
            },
          ],
        },
      ],
    });

    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found." });
    }

    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

//login authentication

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //find a user by their email
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    //if user email is found, compare password with bcrypt
    if (user) {
      const isSame = await bcrypt.compare(password, user.password);

      //if password is the same
      //generate token with the user's id and the secretKey in the env file

      if (isSame) {
        let token = jwt.sign({ id: user.id }, process.env.secretKey, {
          expiresIn: 1 * 24 * 60 * 60 * 1000,
        });

        // Generate a verification code
        const verificationCode = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Code expires in 15 minutes

        // Store the verification code in the database
        await VerificationCode.create({
          user_id: user.id,
          code: verificationCode,
        });

        await sendVerificationCode(user.email, verificationCode);

        //if password matches wit the one in the database
        //go ahead and generate a cookie for the user
        res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        console.log("user", JSON.stringify(user, null, 2));
        console.log(token);
        const maskedEmail = maskEmail(user.email);

        //send user data
        return res.status(200).json({
          status: true,
          message:
            "Veritication code sent to " + maskedEmail + " " + verificationCode,
        });
      } else {
        return res
          .status(200)
          .json({ status: false, message: "Invalid password" });
      }
    } else {
      return res
        .status(200)
        .json({ status: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
  }
};

const bulkUploadUsers = async (req, res) => {
  try {
    const { companies } = req.body;
    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = companies.map((company) => ({
      name: company,
      email: `${company.toLowerCase().replace(/[^a-z0-9]/g, "")}@example.com`,
      profile_image: `https://example.com/images/${company
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")}.jpg`,
      kyc_status: "Verified",
      preference_sector: JSON.stringify(["Tech", "Finance"]),
      preference_region: JSON.stringify(["North America", "Europe"]),
      password: hashedPassword,
      role: "Target Company",
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await User.bulkCreate(users);
    res
      .status(200)
      .json({ status: true, message: "Users uploaded successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get profile of the logged-in user
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] }, // Exclude the password field from the response
      include: [
        {
          model: UserPreferences,
          as: "userPreferences",
          include: [{ model: Sector, as: "sector" }], // Include sector within user preferences
        },
        { model: UserTicketPreferences, as: "ticketPreferences" }, // Include user ticket preferences
        { model: DealTypePreferences, as: "dealTypePreferences" }, // Include deal type preferences
        { model: PrimaryLocationPreferences, as: "primaryLocationPreferences" }, // Include primary location preferences
        { model: ContactPerson, as: "contactPersons" }, // Include contact persons
        {
          model: db.social_media_accounts,
          as: "socialMediaAccounts",
          include: [{ model: SocialAccountType, as: "socialAccountType" }],
        }, // Include social media accounts with social account type
      ], // Include user preferences
    });
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found." });
    }
    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get users with the role Employee or their role_id is that of Employee
const getEmployees = async (req, res) => {
  try {
    // Find the role_id for the Employee role
    const employeeRole = await Role.findOne({ where: { name: "Employee" } });

    if (!employeeRole) {
      return res
        .status(404)
        .json({ status: false, message: "Employee role not found." });
    }

    const employees = await User.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          // { role: "Employee" },
          { role_id: employeeRole.role_id },
        ],
      },
    });

    if (employees.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "No employees found." });
    }

    res.status(200).json({ status: true, employees });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Function to mark a user status as Archived
const markUserAsArchived = async (req, res) => {
  try {
    const user_id = req.params.id;
    const user = await User.findByPk(user_id);

    if (!user) {
      return res
        .status(200)
        .json({ status: false, message: "User not found." });
    }

    await user.update({ status: "Archived" });

    await createAuditLog({
      userId: req.user.id,
      action: "MARK_USER_AS_ARCHIVED",
      details: `Marked user with ID ${user_id} as Archived`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Function to mark a user status as Archived
const markUserAsOpen = async (req, res) => {
  try {
    const user_id = req.params.id;
    const user = await User.findByPk(user_id);

    if (!user) {
      return res
        .status(200)
        .json({ status: false, message: "User not found." });
    }

    await user.update({ status: "Open" });

    await createAuditLog({
      userId: req.user.id,
      action: "MARK_USER_AS_ARCHIVED",
      details: `Marked user with ID ${user_id} as Archived`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Function to mark a user status as On Hold
const markUserAsOnHold = async (req, res) => {
  try {
    const user_id = req.params.id;
    const user = await User.findByPk(user_id);

    if (!user) {
      return res
        .status(200)
        .json({ status: false, message: "User not found." });
    }

    await user.update({ status: "On Hold" });

    await createAuditLog({
      userId: req.user.id,
      action: "MARK_USER_AS_ON_HOLD",
      details: `Marked user with ID ${user_id} as On Hold`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Function to update total investments
const updateTotalInvestments = async (req, res) => {
  try {
    const user_id = req.params.id;
    const { total_investments } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found." });
    }

    await user.update({ total_investments });

    await createAuditLog({
      userId: req.user.id,
      action: "UPDATE_TOTAL_INVESTMENTS",
      details: `Updated total investments for user with ID ${user_id}`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Function to update average check size
const updateAverageCheckSize = async (req, res) => {
  try {
    const user_id = req.params.id;
    const { average_check_size } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found." });
    }

    await user.update({ average_check_size });

    await createAuditLog({
      userId: req.user.id,
      action: "UPDATE_AVERAGE_CHECK_SIZE",
      details: `Updated average check size for user with ID ${user_id}`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Function to update successful exits
const updateSuccessfulExits = async (req, res) => {
  try {
    const user_id = req.params.id;
    const { successful_exits } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found." });
    }

    await user.update({ successful_exits });

    await createAuditLog({
      userId: req.user.id,
      action: "UPDATE_SUCCESSFUL_EXITS",
      details: `Updated successful exits for user with ID ${user_id}`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Function to update portfolio IPR
const updatePortfolioIPR = async (req, res) => {
  try {
    const user_id = req.params.id;
    const { portfolio_ipr } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found." });
    }

    await user.update({ portfolio_ipr });

    await createAuditLog({
      userId: req.user.id,
      action: "UPDATE_PORTFOLIO_IPR",
      details: `Updated portfolio IPR for user with ID ${user_id}`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Function to update description
const updateDescription = async (req, res) => {
  try {
    const user_id = req.params.id;
    const { description } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found." });
    }

    await user.update({ description });

    await createAuditLog({
      userId: req.user.id,
      action: "UPDATE_DESCRIPTION",
      details: `Updated description for user with ID ${user_id}`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Function to update total investments
const updateAddressableMarket = async (req, res) => {
  try {
    const user_id = req.params.id;
    const { addressable_market } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found." });
    }

    await user.update({ addressable_market });

    await createAuditLog({
      userId: req.user.id,
      action: "UPDATE_ADDRESSABLE_MARKET_INVESTMENTS",
      details: `Updated total investments for user with ID ${user_id}`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Function to update total investments
const updateCurrentMarket = async (req, res) => {
  try {
    const user_id = req.params.id;
    const { current_market } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found." });
    }

    await user.update({ current_market });

    await createAuditLog({
      userId: req.user.id,
      action: "UPDATE_CURRENT_MARKET_INVESTMENTS",
      details: `Updated total investments for user with ID ${user_id}`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateTotalAssets = async (req, res) => {
  try {
    const user_id = req.params.id;
    const { total_assets } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found." });
    }

    await user.update({ total_assets });

    await createAuditLog({
      userId: req.user.id,
      action: "UPDATE_CURRENT_MARKET_INVESTMENTS",
      details: `Updated total investments for user with ID ${user_id}`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateEbiTda = async (req, res) => {
  try {
    const user_id = req.params.id;
    const { ebitda } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found." });
    }

    await user.update({ ebitda });

    await createAuditLog({
      userId: req.user.id,
      action: "UPDATE_EBITDA_INVESTMENTS",
      details: `Updated total investments for user with ID ${user_id}`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateGrossMargin = async (req, res) => {
  try {
    const user_id = req.params.id;
    const { gross_margin } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found." });
    }

    await user.update({ gross_margin });

    await createAuditLog({
      userId: req.user.id,
      action: "UPDATE_EBITDA_INVESTMENTS",
      details: `Updated total investments for user with ID ${user_id}`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateCac = async (req, res) => {
  try {
    const user_id = req.params.id;
    const { cac_payback_period } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found." });
    }

    await user.update({ cac_payback_period });

    await createAuditLog({
      userId: req.user.id,
      action: "UPDATE_CAC_PAYBACK_PERIOD",
      details: `Updated   for user with ID ${user_id}`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateTam = async (req, res) => {
  try {
    const user_id = req.params.id;
    const { tam } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found." });
    }

    await user.update({ tam });

    await createAuditLog({
      userId: req.user.id,
      action: "UPDATE_TAM",
      details: `Updated   for user with ID ${user_id}`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateSam = async (req, res) => {
  try {
    const user_id = req.params.id;
    const { sam } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found." });
    }

    await user.update({ sam });

    await createAuditLog({
      userId: req.user.id,
      action: "UPDATE_SAM",
      details: `Updated   for user with ID ${user_id}`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateSom = async (req, res) => {
  try {
    const user_id = req.params.id;
    const { som } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found." });
    }

    await user.update({ som });

    await createAuditLog({
      userId: req.user.id,
      action: "UPDATE_SOM",
      details: `Updated   for user with ID ${user_id}`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateYearFounded = async (req, res) => {
  try {
    const user_id = req.params.id;
    const { year_founded } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found." });
    }

    await user.update({ year_founded });

    await createAuditLog({
      userId: req.user.id,
      action: "UPDATE_YEAR_FOUNDED",
      details: `Updated   for user with ID ${user_id}`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateLocation = async (req, res) => {
  try {
    const user_id = req.params.id;
    const { location } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found." });
    }

    await user.update({ location });

    await createAuditLog({
      userId: req.user.id,
      action: "UPDATE_LOCATION",
      details: `Updated   for user with ID ${user_id}`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Function to update user profile
const updateUserProfile = async (req, res) => {
  try {
    const user_id = req.user.id;
    const {
      name,
      email,
      profile_image,
      total_investments,
      average_check_size,
      successful_exits,
      portfolio_ipr,
      description,
      addressable_market,
      current_market,
      total_assets,
      ebitda,
      gross_margin,
      cac_payback_period,
      tam,
      sam,
      som,
      year_founded,
      location,
    } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res
        .status(200)
        .json({ status: false, message: "User not found." });
    }

    const updatedFields = {};

    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (profile_image) updatedFields.profile_image = profile_image;
    if (total_investments) updatedFields.total_investments = total_investments;
    if (average_check_size)
      updatedFields.average_check_size = average_check_size;
    if (successful_exits) updatedFields.successful_exits = successful_exits;
    if (portfolio_ipr) updatedFields.portfolio_ipr = portfolio_ipr;
    if (description) updatedFields.description = description;
    if (addressable_market)
      updatedFields.addressable_market = addressable_market;
    if (current_market) updatedFields.current_market = current_market;
    if (total_assets) updatedFields.total_assets = total_assets;
    if (ebitda) updatedFields.ebitda = ebitda;
    if (gross_margin) updatedFields.gross_margin = gross_margin;
    if (cac_payback_period)
      updatedFields.cac_payback_period = cac_payback_period;
    if (tam) updatedFields.tam = tam;
    if (sam) updatedFields.sam = sam;
    if (som) updatedFields.som = som;
    if (year_founded) updatedFields.year_founded = year_founded;
    if (location) updatedFields.location = location;

    await user.update(updatedFields);
    await createNotification(
      user_id,
      "Profile Updated",
      "Your profile has been updated."
    );

    await createAuditLog({
      userId: req.user.id,
      action: "UPDATE_USER_PROFILE",
      details: `Updated profile for user with ID ${user_id}`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Function to update user profile
const adminUpdateUserProfile = async (req, res) => {
  try {
    const user_id = req.params.id;
    const {
      name,
      email,
      profile_image,
      total_investments,
      average_check_size,
      successful_exits,
      portfolio_ipr,
      description,
      addressable_market,
      current_market,
      total_assets,
      ebitda,
      gross_margin,
      cac_payback_period,
      tam,
      sam,
      som,
      year_founded,
      location,
    } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res
        .status(200)
        .json({ status: false, message: "User not found." });
    }

    const updatedFields = {};

    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (profile_image) updatedFields.profile_image = profile_image;
    if (total_investments) updatedFields.total_investments = total_investments;
    if (average_check_size)
      updatedFields.average_check_size = average_check_size;
    if (successful_exits) updatedFields.successful_exits = successful_exits;
    if (portfolio_ipr) updatedFields.portfolio_ipr = portfolio_ipr;
    if (description) updatedFields.description = description;
    if (addressable_market)
      updatedFields.addressable_market = addressable_market;
    if (current_market) updatedFields.current_market = current_market;
    if (total_assets) updatedFields.total_assets = total_assets;
    if (ebitda) updatedFields.ebitda = ebitda;
    if (gross_margin) updatedFields.gross_margin = gross_margin;
    if (cac_payback_period)
      updatedFields.cac_payback_period = cac_payback_period;
    if (tam) updatedFields.tam = tam;
    if (sam) updatedFields.sam = sam;
    if (som) updatedFields.som = som;
    if (year_founded) updatedFields.year_founded = year_founded;
    if (location) updatedFields.location = location;

    await user.update(updatedFields);
    await createNotification(
      user_id,
      "Profile Updated",
      "Your profile has been updated."
    );

    await createAuditLog({
      userId: req.user.id,
      action: "UPDATE_USER_PROFILE",
      details: `Updated profile for user with ID ${user_id}`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  updateAddressableMarket,
  updateCurrentMarket,
  updateTam,
  updateSam,
  updateLocation,
  updateYearFounded,
  updateSom,
  updateCac,
  updateEbiTda,
  updateTotalAssets,
  updateGrossMargin,
  signup,
  login,
  verifyCode,
  logout,
  forgotPassword,
  resetPassword,
  getUsersByType,
  bulkUploadUsers,
  getUserById,
  getProfile,
  getEmployees,
  updateUserStatus,
  markUserAsArchived,
  markUserAsOpen,
  markUserAsOnHold,
  updateTotalInvestments, // Add this line
  updateAverageCheckSize, // Add this line
  updateSuccessfulExits, // Add this line
  updatePortfolioIPR, // Add this line
  updateDescription, // Add this line
  updateUserProfile, // Add this line
  adminUpdateUserProfile, // Add this line
};
