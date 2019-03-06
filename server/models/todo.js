const mongoose = require('mongoose');


var ToDo = mongoose.model('ToDo',{
    text:{
        type:String,
        required : true,
        minlength :1,
        trim:true
    },
    completed : {
        type:Boolean,
        default:false
    },
    completedAt : {
        type:Number,
        default : null
    },
    _creator : mongoose.Schema.Types.ObjectId
});

module.exports = {ToDo};