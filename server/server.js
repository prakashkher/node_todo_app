const express = require('express');
const bodyParser = require('body-parser');

var {ObjectID} = require('mongodb');

var mongoose = require('./db/mongoose');
var {User} = require('./models/user');
var {ToDo} = require('./models/todo');

var port = process.env.PORT || 3000.
var app = express();
app.use(bodyParser.json());
app.post('/save-todo',(req,res)=>{
    var todo = new ToDo({text:req.body.text});
    todo.save().then((doc)=>{
        console.log('ToDo saved');
        res.send(doc);
    },(e)=>{
        
        res.status(400).send(e);
    });
});

app.get('/get-todos',(req,res)=>{
    ToDo.find().then((todos)=>{
        res.send({todos});
    },(e)=>{
        res.status(400).send(e);
    });
});

app.get('/get-todo/:id',(req,res)=>{
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).send({msg:'Todo Id is invalid'});
    }
    
    ToDo.findById(req.params.id).then((todo)=>{
        if(!todo){
            return res.status(404).send({msg:'Todo not found'});
        }
        res.send({todo});
    },(e)=>res.status(400).send(e));

});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});

module.exports = {app};