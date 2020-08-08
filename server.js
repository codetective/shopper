const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const stockModel = require("./stock");

//connect database
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost/shop", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", function () {
  console.log("database is connected");
});
db.on("error", (e) => {
  console.log(e);
});
// db.collections.stocks.drop(() => {
//   console.log('dropped');
// })

const cors = require("cors");
const stock = require("./stock");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  stockModel.find((err, stocks) => {
    if (err) {
      res.json({
        error: err.message,
      });
    } else {
      res.json({
        stocks,
      });
    }
  });
});

//adding stock
app.post("/", function (req, res) {
  if (req.body.name === undefined || "" || req.body.qty === undefined || "") {
    res.json({
      msg: "form data incomplete",
    });
  } else {
    const newStock = {
      name: req.body.name.toLowerCase().toString(),
      qty: req.body.qty,
    };
    stockModel
      .findOne({
        name: newStock.name,
      })
      .then((stock) => {
        if (!stock) {
          stockModel
            .create(newStock)
            .then((doc) => {
              res.json({
                status: "success",
                message: "stock added sucessfully",
              });
            })
            .catch((err) => {
              res.json({
                error: err.message,
              });
            });
        } else {
          res.json({
            msg: "Stock already exists",
          });
        }
      })
      .catch((err) => {
        res.send({
          err,
          msg: err,
        });
      });
  }
});

//adding sale
app.post("/sale", async function (req, res) {
  let resp = [];
  let errm = [];
  let count = 0;
  const result = await req.body.forEach((item) => {
    count++;
    stockModel
      .findOne({ name: item.name.toLowerCase().toString() })
      .then((doc) => {
        if (!doc) {
          res.json({
            status: "error",
            msg: "Stocks invalid",
          });
        } else {
          doc.qty = doc.qty - item.qty;
          doc
            .save()
            .then((dc) => {
              resp.push("saved " + dc.name +' :' + dc.qty);
              if (count === req.body.length) {
                res.json({
                  status: 'success',
                  info : JSON.stringify(resp)
                })
              }
            })
            .catch((err) => {
              errm.push("error occured on item :" + count);
              if (count === req.body.length && errm.length === req.body.length) {
                 res.json({
                   status: "error",
                   info: JSON.stringify(errm),
                 });
              } else {
                return;
               }
            });
        }
      })
      .catch((err) => {
        res.json({
          status: 'error',
          msg: 'cannot update sales'
        })
      });
  });
});

app.delete("/", function (req, res) {
  stockModel
    .findOneAndDelete({
      name: req.body.name,
    })
    .then((doc) => {
      if (doc === null) {
        res.json({
          msg: "document does not exist",
        });
      } else {
        res.status(200).json({
          doc,
        });
      }
    });
});

app.put("/", function (req, res) {
  stockModel
    .findOne({
      name: req.body.name
    })
    .then((doc) => {
      doc.updateOne({qty : req.body.qty}).then((dck) => {
        console.log(dck);
        res.json({
          status: 'success',
          message: 'updated'
     })
   })
    })
    .catch((err) => {
      res.json({
        status: "failed",
        error: 'stock does not exist in database',
      });
    });
});

app.get("*", function (req, res) {
  res.status(404).send({ error: "page does not exist. Winter is Coming!!" });
});

app.listen(port, () => console.log(`listening at http://localhost:${port}`));
