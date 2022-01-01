var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://chaeng:chaeng222@first-project.fz0fj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("DB connected");
});

const Schema = mongoose.Schema;

const Memo = new Schema({
  author: String,
  contents: String,
  data: Date
});

const memoModel = mongoose.model('Memo', Memo);

router.get('/', function(req, res, next) {
  res.render('index', {title: 'Express'});
});

router.get('/load', function(req, res, next) {
  memoModel.find({}, function(err, data){
    res.json(data);
  });
});

router.post('/write', function(req, res, next) {
  let author = req.body.author;
  let contents = req.body.contents;
  let date = Date.now();

  let memo = new memoModel();

  memo.author = author;
  memo.contents = contents;
  memo.date = date;
  memo.comments = [];

  memo.save(function (err) {
    if (err) {
      throw err;
    } else {
      res.json({status: "success"});
    }
  });
});

router.post('/delete', function(req, res, next) {
  let _id = req.body._id;
  memoModel.deleteOne({_id:id}, function(err, result){
    if(err) {
      throw err;
    } else {
      res.json({status: "success"});
    }
  });
});

module.exports = router;
