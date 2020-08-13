const Stock = require('../models/stockModel')

let addStock, editStock, deleteStock, regSale, getStocks

getStocks = (req, res) => {
  Stock.find((err, stocks) => {
    if (err) {
      res.json({
        error: err.message
      })
    } else {
      res.json({
        stocks
      })
    }
  })
}

addStock = (req, res) => {
  const newStock = {
    name: req.body.name.toLowerCase().toString(),
    qty: req.body.qty
  }
  Stock
    .findOne({
      name: newStock.name
    })
    .then(stock => {
      if (!stock) {
        Stock
          .create(newStock)
          .then(doc => {
            res.json({
              status: 'success',
              message: 'stock added sucessfully'
            })
          })
          .catch(err => {
            res.json({
              error: err.message
            })
          })
      } else {
        res.json({
          msg: 'Stock already exists'
        })
      }
    })
    .catch(err => {
      res.send({
        err: 'an error occurred',
        msg: err
      })
    })
}

regSale = async (req, res) => {
  let resp = [];
  let errm = [];
  let count = 0;
  const result = await req.body.forEach(item => {
    count++
    Stock
      .findOne({
        name: item.name.toLowerCase().toString()
      })
      .then(doc => {
        if (!doc) {
          res.json({
            status: 'error',
            msg: 'Stocks invalid'
          })
        } else {
          doc.qty = doc.qty - item.qty
          doc
            .save()
            .then(dc => {
              resp.push('saved ' + dc.name + ' :' + dc.qty)
              if (count === req.body.length) {
                res.json({
                  status: 'success',
                  info: JSON.stringify(resp)
                })
              }
            })
            .catch(err => {
              errm.push('error occured on item :' + count)
              if (count === req.body.length && errm.length === req.body.length) {
                res.json({
                  status: 'error',
                  info: JSON.stringify(errm)
                })
              } else {
                return
              }
            })
        }
      })
      .catch(err => {
        res.json({
          status: 'error',
          msg: 'cannot update sales'
        })
      })
  })
}

editStock = (req, res) => {
  if (req.body.qty < 1) {
    res.json({
      error: 'values cannot be less than 1'
    })
  } else {
  
  Stock
    .findOne({
      name: req.body.name.toLowerCase()
    })
    .then(doc => {
      doc.updateOne({ qty: req.body.qty }).then(dck => {
        res.json({
          status: 'success',
          message: 'updated'
        })
      })
    })
    .catch(err => {
      res.json({
        status: 'failed',
        error: 'stock does not exist in database'
      })
    })
}

}

deleteStock = (req, res) => {
  Stock.findOne({
      name: req.body.name
    })
    .then(Stock => {
      if (!Stock) {
        res.json({
          msg: 'document does not exist'
        })

      } else {
        Stock.deleteOne({
            name: req.body.name
          })
          .then(
            res.json({
              status: 'succesfully deleted Stock'
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
        error: 'invalid Stock name'
      })
    })
}

module.exports = {
  addStock,
  editStock,
  deleteStock,
  regSale,
  getStocks
}