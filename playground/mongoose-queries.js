const {mongoose} = require('./../server/db/mongoose');
const {User} = require('./../server/models/user');

var id = '5c7675e5a6d93a20946f52ea';
User.findById(123).then((user)=>{
    console.log(user);
});