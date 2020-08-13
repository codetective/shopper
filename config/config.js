
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')

const config = {
  admin: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
      const user = {
        role: decodedToken.role,
        userId: decodedToken.id,
        name: decodedToken.name
      }

      User.findOne({ _id: user.userId })
        .then(doc => {
          if (user.role !== 'admin') {
            res.json({
              status: 'error',
              message: 'unauthorized for this action'
            })
          } else {
            res.locals.user = user
            next()
          }
        })
        .catch(err => {
          res.json({
            error: err.message
          })
        })
    } catch (err) {
      res.status(401).json({
        error: err.message
      })
    }
  }
}

module.exports = config
