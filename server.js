var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
//models
var Todo = require('./models/Todo');

mongoose.connect('mongodb://127.0.0.1/todo-app');

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
    if(Object.keys(todos).length == 0)
      res.json('No todos found');
    else {
      res.send(todos);
    }

  }).
  catch(next);
});

app.post('/api/todos', function(req, res) {
  var text = req.body.text;
  if(text){
    Todo.create({
      text: text,
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
  }
  else {
    Todo.find(function(err, todos) {
      if(err)
        res.send(err);
      res.send(todos + '\nNo todos to post');
    });
  }

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
  res.sendFile('/public/index.html');
});

app.listen(8080);
console.log("App listening on port 8080");
