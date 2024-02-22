const User = require("../models/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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

exports.Login = async (req, res, next) => {
  try {
    const useremail = req.body.email;
    const userpassword = req.body.password;
    const user = await User.findOne({ email: useremail });
    const { id, email, _id } = user;
    if (user) {
      const valid = await bcrypt.compareSync(userpassword, user.password);
      if (valid) {
        const token = jwt.sign({ id, email, _id }, process.env.AUTH_SECRET);
        res.status(200).json({
          success: true,
          message: "Logged In Successfully",
          _id,
          email,
          token
        });
      } else {
        res
          .status(500)
          .json({ success: false, message: "Input correct password" });
      }
    }
  } catch (error) {
    if (error) {
      return res.json({
        success: false,
        errors: "Incorrect Email or Password",
      });
    }
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