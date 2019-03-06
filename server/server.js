const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
var {ObjectID} = require('mongodb');

var mongoose = require('./db/mongoose');
var {User} = require('./models/user');
var {ToDo} = require('./models/todo');
const {authenticate} = require('./authenticate/authenticate');

var port = process.env.PORT || 3000.
var app = express();
app.use(bodyParser.json());
app.post('/save-todo',authenticate,(req,res)=>{
    var todo = new ToDo({
        text:req.body.text,
        _creator : req.user._id
    });
    return todo.save().then((doc)=>{
        return res.send(doc);
    }).catch((e)=>{
        console.log(e);
        return res.status(400).send();
    });
});

app.get('/get-todos',authenticate,(req,res)=>{
    ToDo.find({
        _creator : req.user._id
    }).then((todos)=>{
        res.send({todos});
    },(e)=>{
        res.status(400).send(e);
    });
});

app.get('/get-todo/:id',authenticate,(req,res)=>{
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).send({msg:'Todo Id is invalid'});
    }
    
    ToDo.findOne({
        _id:req.params.id,
        _creator:req.user._id
    }).then((todo)=>{
        if(!todo){
            return res.status(404).send({msg:'Todo not found'});
        }
        res.send({todo});
    },(e)=>res.status(400).send(e));

});

app.delete('/todo/:id',authenticate,(req,res)=>{
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).send();
    }

    ToDo.findOneAndRemove({
        _id:req.params.id,
        _creator:req.user._id
    }).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    },(e)=>{
        res.status(400).send(e);
    });
});

app.patch('/todo/:id',authenticate,(req,res)=>{
    var id = req.params.id;
    
    if(!ObjectID.isValid(id)){
        console.log('Invalid Id');
        return res.status(400).send();
    }
    var body = _.pick(req.body,['text','completed']);

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completedAt = null;
        body.completed = false;   
    }

    ToDo.findOneAndUpdate({
        _id:id,
        _creator:req.user._id
    },{$set:body},{new:true}).then((todo)=>{
        if(!todo){
            console.log('Todo not found');
            return  res.status(404).send();
        }
        res.send({todo});
    }).catch((e)=>{
        console.log('Error:',e);
        return res.status(400).send(e);
    });
});

app.post('/user',(req,res)=>{
    var body = _.pick(req.body,'email','password');
    
    var user = new User(body);
    
    user.save().then((user)=>{
       
       return user.generateAuthToken();
    }).then((token)=>{
        console.log(token);
        res.header('x-auth',token).send(user);
    }).catch((e)=>{
        console.log(e);
        res.status(400).send(e);
    });
});

app.get('/users/me',authenticate,(req,res)=>{
    res.send(req.user);
});

app.post('/login',(req,res)=>{
    
    User.findByCredentials(req.body.email,req.body.password).then((user)=>{
        user.generateAuthToken().then((token)=>{
            res.header('x-auth',token).send(user);
        });
    }).catch((e)=>{
        res.status(400).send();
    });

    
});


app.delete('/user/me/token',authenticate,(req,res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.send();
    },(e)=>{
        res.status(401).send();
    });
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});

module.exports = {app};