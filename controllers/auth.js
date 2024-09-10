const User = require("../models/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { executeQuery } = require("../models");
const { networkInterfaces } = require('os');
const os = require('os');

const getIPAddress = () => {
  const nets = networkInterfaces();
  let ipAddress = null;
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        ipAddress = net.address;
        break;
      }
    }
    if (ipAddress) break;
  }

  return ipAddress;
};


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
    const sql = 'SELECT * FROM users WHERE email = $1';
    const users = await executeQuery(sql, [useremail]);
    const ipAddress = getIPAddress();
    if (users.length > 0) {
      const user = users[0];
      const valid = bcrypt.compareSync(userpassword, user.password);

      if (valid) {
        const token = jwt.sign({ id: user.user_id, email: user.email }, process.env.AUTH_SECRET, {
          expiresIn: '1h'
        });
        res.status(200).json({
          success: true,
          message: "Logged In Successfully",
          id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
          token,
          ip: ipAddress,
          hostname: os.hostname()
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
      stack: error.stack
    });
    if (error.stack) console.error(error.stack);
    res.status(500).json({
      success: false,
      message: "An error occurred during the login process.",
      error: error.message
    });
  }
};

exports.getUserById = async (req, res, next) => {
  const { user_id } = { ...req.params, ...req.body, ...req.query };
  try {
    const sql = 'SELECT * FROM users WHERE user_id = $1';
    const user = await executeQuery(sql, [user_id]);
    if (user) {
      res.status(200).json({
        success: true,
        message: "User Loaded Successfully",
        data: user
      });
    } else {
      res.status(401).json({ success: false, message: "Incorrect Password" });
    }
  } catch (error) {
    console.error({
      timestamp: new Date().toISOString(),
      type: 'LoginError',
      message: error.message,
      stack: error.stack
    });
    if (error.stack) console.error(error.stack);
    res.status(500).json({
      success: false,
      message: "An error occurred loadin the user.",
      error: error.message
    });
  }
}

exports.ssoLogin = async (req, res, next) => {
  let { user_id, name, email, role, image_url } = req.body;
  role = role || 'user';
  try {
    const response = await executeQuery(
      'SELECT * FROM  users WHERE email = $1',
      [email]
    );
    if (Object.entries(response).length > 0) {
      const user = response[0];
      return res.status(200).json(user);
    }
    const result = await executeQuery(
      'INSERT INTO users (user_id,name, email,role, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, name, email, role, image_url]
    );
    return res.status(201).json(result);

  } catch (error) {
    console.error('Error during SSO login/signup:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}