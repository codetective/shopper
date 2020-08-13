const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/userModel')


const getUsers = (req, res) => {
  User.find(function (err, users) {
    if (err) {
      res.json(err)
    } else {
      res.json(users)
    }
  })
}


const loginUser = (req, res) => {
  User.findOne({
    name: req.body.name
  })
    .then(user => {
      if (user) {
        const profile = {
          name: user.name,
          role: user.role,
          date: user.date
        }
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const payload = {
            id: user._id,
            name: user.name,
            role: user.role
          }
          let token = jwt.sign(payload, process.env.SECRET_KEY , {
            expiresIn: 999999
          })
          res.send({
            status: 'You have logged in successfully',
            token: token,
            profile
          })
        } else {
          res.json({
            error: 'Password incorrect'
          })
        }
      } else {
        res.json({
          error: 'name or password incorrect'
        })
      }
    })
    .catch(err => {
      res.send({
        error: err.message
      })
    })
}




const regUsers = (req, res) => {
  const today = new Date()
  const userData = {
    name: req.body.name,
    password: req.body.password,
    role: req.body.role,
    created: today
  }

  User.findOne({
    name: req.body.name
  })
    .then(user => {
      if (!user) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          userData.password = hash
          User.create(userData)
            .then(user => {
              res.json({
                status:
                  user.name +'(' +user.role+ ')' + ' has been registered'
              })
            })
            .catch(err => {
              res.send({
                error: err.message
              })
            })
        })
      } else {
        res.json({
          error: user.name + ' already exists'
        })
      }
    })
    .catch(err => {
      res.send({
        error: err.message
      })
    })
}


const deleteUser = (req, res) => {
  User.findOne({ name: req.body.name})
    .then(user => {
      if (!user) {
        res.json({
          status: 'error',
          message: 'user not found'
        })
      } else {
        User.deleteOne({
          name: req.body.name
        })
          .then(
            res.json({
              status: 'succesfully deleted account'
            })
          )
          .catch(err => {
            res.json({
              error: err.message
            })
          })
      }
    })
    .catch(err => {
      res.json({
        error: 'invalid user name'
      })
    })
}



module.exports = {
  loginUser,
  regUsers,
  getUsers,
  deleteUser
}
