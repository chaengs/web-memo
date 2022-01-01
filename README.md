### 1.기획 의도

메모장으로 간단한 내용을 기록하고 저장하기 위함이다.

### 2. 주요 기능

텍스트를 작성할 수 있으며 저장할 수 있다.

### 3. 주요 코드

### index.js

```jsx
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
```

### index.html

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>웹 메모장</title>
    <link rel="stylesheet" href="./stylesheets/style.css">
    <script src="//code.jquery.com/jquery.min.js"></script>
    <script>
        var load = null;
        var write = null;
        var del = null;

        $(document).ready(function () {
            load = function () {
                $.get('/load', function (data){
                    $("#memo").empty();
                    
                    $(data).each(function (i){  // 포문을 돌면서 각 메모를 출력
                        var id = this._id;
                        $("#memo").prepend("<div class='item'></div>");
                        $("#memo .item:first").append("<div class='photo_thumb'></div>");
                        $("#memo .item:first").append("<div class='author'><b>" + this.author + "</b> (" + this.date + ")&nbsp;&nbsp;");
                        $("#memo .item:first").append("<div class='contents " + id + "'>" + this.contents + "</div>");
                        
                        var cnt = 0;
                    });
                });
            };
            
            write = function(contents) {
                var postdata = {
                    'author': $("#author").val(),
                    'contents': contents
                };
                $.post('/write', postdata, function() {
                    load();
                });
            };
            
            $("#write textarea").keypress(function(evt){
                if((evt.keyCode || evt.which) == 13){  // 쓰기 영역에서 엔터 버튼을 눌렀을 때
                    if(this.value!= "") {
                        write(this.value);
                        evt.preventDefault();
                        $(this).val("");
                    }
                }
            });
            
            $("#write_button").click(function(evt){  // 쓰기 버튼을 클릭했을 때
                console.log($("#write textarea").val());
                write($("#write textarea").val());
                $("#write textarea").val("");
            });
            
            load();
        });
    </script>
</head>
<body>
    <div id='main'>
        <div id='write'>
            <div class='title'>
                <input id='author' class='author' type='text' placeholder='메모 제목' />
            </div>
            <div class='content'>
                <textarea placeholder='내용을 입력하세요'></textarea>
                <br />
                <input id='write_button' type='button' value='쓰기' />
            </div>
        </div>
        <div id='memo'>
            <div class='item'>
            </div>
        </div>
    </div>
</body>
</html>
```

### 4. 사용 언어

HTML, CSS, Node.js, jQuery