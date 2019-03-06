const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
    email:{
        type : String,
        required : true,
        minlength :1,
        trim:true,
        unique : true,
        validate:{
            validator:validator.isEmail,
            message:'{VALUE} is not a valid email'
        }
    },
    password:{
        type:String,
        require:true,
        minlength:6
    },
    tokens:[{
        access:{
            type:String,
            required :true
        },
        token:{
            type:String,
            required :true
        }
    }]
});

UserSchema.methods.generateAuthToken  = function () {
    console.log('inside getokn');
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id:user._id.toHexString(),access},'123abc').toString();

    user.tokens = user.tokens.concat([{access,token}]);

    return user.save().then(()=>{
        return token;
    });
};

UserSchema.statics.findByToken = function (token){
    var decoded;

    try{
        decoded = jwt.verify(token,'123abc');

        return User.findOne({
            '_id':decoded._id,
            'tokens.access' : 'auth',
            'tokens.token' : token
        });
    }catch(e){
        return Promise.reject();
    }
};

UserSchema.methods.removeToken = function(token){
    var user = this;

    return user.update({
        $pull:{
            tokens: {
                token
            }
        }
    });
};

UserSchema.pre('save', function(next){
    var user = this;
    if(user.isModified('password')){
        console.log('inside bcrypt');
        bcrypt.genSalt(10,(err,salt)=>{
            console.log('salt:',salt);
            if(err){
                console.log('error1:',err);
            }
            bcrypt.hash(user.password,salt,function(err,hash){
                console.log('hash:',hash);
                if(err){
                    console.log('error2:',err);
                }
                user.password = hash;
                console.log('password :',user.password);
                next();
            });
        });
       
        
    }else{
        next();
    }
} );

UserSchema.statics.findByCredentials = function(email,password){
    
    return User.findOne({email}).then((user)=>{
        
        if(!user){
            return Promise.reject();
        }
        
        return new Promise((resolve,reject)=>{
            
            bcrypt.compare(password,user.password,function(err,res){
                
                if(!res){
                    reject();
                }
                
                resolve(user);
            });
        });
    }).catch((e)=>{
       
        return Promise.reject();
    });
};

UserSchema.methods.toJSON = function(){
    var userObject = this.toObject();
    return _.pick(userObject,'email','_id');
};

var User = mongoose.model('User',UserSchema);

module.exports = {User};