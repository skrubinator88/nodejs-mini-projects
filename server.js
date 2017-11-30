var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
//models
var Todo = require('./models/Todo');
var DB_USER = process.env.DB_USER;
var DB_PASS = process.env.DB_PASS;
mongoose.connect('mongodb://' + DB_USER + ':' + DB_PASS + '@ds149124.mlab.com:49124/test-ivb');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended' : 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));
app.use(methodOverride());

//routes

//api
app.get('/api/todos', function(req, res, next) {
  Todo.find(function(err, todos) {
    if(err)
      res.send(err);
    res.send(todos);

  });
});

app.post('/api/todos', function(req, res) {

    Todo.create({
      text: req.body.text,
      done: false
    }, function(err, todo) {
      if(err)
        res.send(err);
      Todo.find(function(err, todos) {
        if(err)
          res.send(err);
        res.json(todos);
      });


    });
  });


app.delete('/api/todos/:todo_id', function(req, res) {
    Todo.remove({
      _id: req.params.todo_id
    }, function(err, todo) {
      if(err)
        res.send(err);

      Todo.find(function(err, todos){
        if(err){
          res.send(err);
        }

        res.json(todos);
      });
    });
});

app.get('*', function(req, res) {
  res.sendFile('/index.html');
});

app.set('port', (process.env.PORT || 8080));

app.listen(app.get('port'), function() {
    console.log("App listening on port " + app.get('port'));
});
