const express = require('express')
const cors = require('cors')
const router = express.Router()
const config = require('../config/config')

const {
  loginUser,
  regUsers,
  getUsers,
  deleteUser
} = require('../controllers/userController')
router.use(cors())

router.post('/login', loginUser)
router.post('/register', config.admin, regUsers)
router.get('/users', getUsers)
router.delete('/delete', config.admin, deleteUser)

module.exports = router
