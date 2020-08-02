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
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("database is connected");
});

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
    console.log(req.body);
    res.json({
      msg: "form data incomplete",
    });
  } else {
    const newStock = {
      name: req.body.name.toString(),
      qty: req.body.qty,
    };
    stockModel
      .findOne({
        name: req.body.name,
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
  const update = {
    name: req.body.name,
    qty: req.body.qty
}
   stockModel.findOneAndUpdate(req.body.name, update, {
     new: true,
     useFindAndModify: false,
   })
   .then((doc) => {
     res.json({
       msg: "sucess",
       doc,
     });
   })
   .catch((err) => {
     res.json({
       status: "failed",
       error: err.message,
     });
   });
})

app.get("*", function (req, res) {
  res.status(404).send({ error: "page does not exist. Winter is Coming!!" });
});

app.listen(port, () => console.log(`listening at http://localhost:${port}`));
