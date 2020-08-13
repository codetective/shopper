const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const port = process.env.PORT || 3000
require('dotenv').config()


const userRoutes = require('./routes/userRoutes')
const stockRoutes = require('./routes/stockRoutes')
const app = express()

//Configuring Express
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Configure MongoDB Database
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost/shop', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(response => {
    console.log('MongoDB Database Running Successfully')
  })
  .catch(err => {
    console.log(err)
  })
mongoose.connection.collections.users.drop(() => {
    console.log('dropped');
  })

app.use('/', userRoutes)
app.use('/', stockRoutes)

app.get('*', function (req, res) {
  res.status(404).send({ error: 'page does not exist. Winter is Coming!!' })
})
app.listen(port, (req, res) => {
  console.log(`Server Is Live At Port ` + port)
})