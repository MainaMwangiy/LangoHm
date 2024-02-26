const User = require("../models/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { executeQuery } = require("../models");

exports.Register = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    let user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, salt),
      deleted: false,
    });
    user
      .save()
      .then((user) => {
        res.status(201).json({
          sucess: true,
          message: "Added successfully",
          responseStatusCode: 201,
          responseDescription: "User was created successfully",
          data: user,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(401).json({
          sucess: false,
          responseStatusCode: 401,
          responseDescription: "Client side error, check on your request body",
          data: err,
        });
      });
  } catch (error) {
    if (error) {
      return res.status(500).json({
        success: false,
        errors: "Failed to add a new entry",
      });
    }
    next(error);
  }
};

exports.Login = async (req, res) => {
  const { email: useremail, password: userpassword } = { ...req.params, ...req.body, ...req.query };
  try {
    console.log("testing in production")
    const sql = 'SELECT * FROM users WHERE email = $1';
    const users = await executeQuery(sql, [useremail]);

    if (users.length > 0) {
      const user = users[0];
      const valid = bcrypt.compareSync(userpassword, user.password);

      if (valid) {
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.AUTH_SECRET, {
          expiresIn: '1h'
        });
        res.status(200).json({
          success: true,
          message: "Logged In Successfully",
          id: user.id,
          email: user.email,
          token
        });
      } else {
        res.status(401).json({ success: false, message: "Incorrect Password" });
      }
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error({
      timestamp: new Date().toISOString(),
      type: 'LoginError',
      message: error.message,
      stack: error.stack,
      useremail,
    });
    console.log(`Database connection string: ${process.env.DATABASE_URL}`);
    if (error.stack) console.error(error.stack);
    res.status(500).json({
      success: false,
      message: "An error occurred during the login process.",
      error: error.message
    });
  }
};


exports.getUsers = async (req, res, next) => {
  try {
    const user = await User.find({});
    if (user) {
      res.status(200).json({ user });
    } else {
      throw new Error();
    }
  } catch (error) {
    if (error) {
      return res.json({
        success: false,
        errors: "No details found",
      });
    }
  }
};

exports.getAllSoftDeletedUsers = async (req, res) => {
  User.find()
    .where("deleted")
    .equals(true)
    .then((data) => {
      res
        .status(200)
        .json({
          responseStatusCode: 200,
          responseDescription: "users fetch success!",
          data: data,
        });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(200)
        .json({
          responseStatusCode: 500,
          responseDescription:
            "we encountered an error while fetching the users!",
          error: err,
        });
    });
};

exports.getAllActiveUsers = async (req, res) => {
  User.find()
    .where("deleted")
    .equals(false)
    .then((data) => {
      res
        .status(200)
        .json({
          responseStatusCode: 200,
          responseDescription: "users fetch success!",
          data: data,
        });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(200)
        .json({
          responseStatusCode: 500,
          responseDescription:
            "we encountered an error while fetching the users!",
          error: err,
        });
    });
};

exports.softDeleteUsers = async (req, res, next) => {
  let deleteReqBody = {
    deleted: true,
  };
  User.findByIdAndUpdate({ _id: req.body.id }, deleteReqBody)
    .then((data) => {
      res.status(200).json({
        responseStatusCode: 200,
        responseDescription: "User soft deleted successfully!",
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(200).json({
        responseStatusCode: 500,
        responseDescription:
          "we encountered an error while deleting the user! supply a correct ID",
        error: err,
      });
    });
};

exports.editUsers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.email = req.body.email;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = bcrypt.hashSync(req.body.password, salt);
    }
    await user.save();
    res.status(200).json({ message: "User Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.getProfile = async (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .where("deleted")
    .equals(false)
    .then((data) => {
      res.status(200).json({
        responseStatusCode: 200,
        responseDescription: "User profile loaded successfully!",
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(200).json({
        responseStatusCode: 500,
        responseDescription:
          "we encountered an error while deleting the user! supply a correct ID",
        error: err,
      });
    });
};