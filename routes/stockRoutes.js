const express = require('express')
const cors = require('cors')
const router = express.Router()
const config = require('../config/config')

const {
  addStock,
  editStock,
  deleteStock,
  regSale,
  getStocks
} = require('../controllers/stockController')
router.use(cors())

router.get('/', getStocks)
router.post('/', config.admin, addStock)
router.delete('/', config.admin, deleteStock)
router.put('/', config.admin, editStock)
router.post('/sale', regSale)

module.exports = router
