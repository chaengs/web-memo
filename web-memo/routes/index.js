let express = require('express');
let router = express.Router();
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://chaeng:chaeng222@first-project.fz0fj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("DB 연결");
});

const Schema = mongoose.Schema;

const Memo = new Schema({
  author: String,
  contents: String,
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

  let memo = new memoModel();

  memo.author = author;
  memo.contents = contents;

  memo.save(function (err) {
    if (err) {
      throw err;
    } else {
      res.json({status: "success"});
    }
  });
});

module.exports = router;
