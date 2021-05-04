// Copyright (c) 2020 Research Team - Softwarica College
// of IT and E-Commerce

// Definitions of Campus 4.0 by:
// Aniket Kharel <https://github.com/aniketkharel>
// Rishav Maskey <https://github.com/reshav401>
// Manjish Pradhan <https://github.com/manjish>
// Bishes Upadhyaya <https://github.com/bishesu>
// Raju Shrestha <https://github.com/ShresthaRaju>
// Node js Version: 12x

const {
    ADMINISTRATOR,
    TRAVEL,
    USER
  } = require('../role')
  
  module.exports = {
    ensureIsAdmin: function (req, res, next) {
      if (!req.session.token) {
        return res.status(403).json({
          success: false,
          message: 'Please log in first',
          warning: 'Your activity logs are continously being monitored.',
        })
      } else if (req.session.type === ADMINISTRATOR) {
        return next()
      } else {
        res.status(403).json({
          success: false,
          message: `Operation Denied to user ${req.session.email}`,
          warning: 'Your activity logs are continously being monitored.',
        })
      }
    },
    ensureIsTravelAgent: function (req, res, next) {
      if (!req.session.token) {
        return res.status(403).json({
          success: false,
          message: 'Please log in first',
          warning: 'Your activity logs are continously being monitored.',
        })
      } else if (req.session.type === TRAVEL) {
        return next()
      } else {
        res.status(403).json({
          success: false,
          message: `Operation Denied to user ${req.session.email}`,
          warning: 'Your activity logs are continously being monitored.',
        })
      }
    },
    ensureIsUser: function (req, res, next) {
      if (!req.session.token) {
        return res.status(403).json({
          success: false,
          message: 'Please log in first',
          warning: 'Your activity logs are continously being monitored.',
        })
      } else if (req.user.type === USER) {
        return next()
      } else {
        res.status(403).json({
          success: false,
          message: `Operation Denied to user ${req.session.email}`,
          warning: 'Your activity logs are continously being monitored.',
        })
      }
    },
  }
  