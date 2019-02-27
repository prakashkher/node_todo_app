const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017',(err,dbo)=>{
if(err) {
    return console.log('Unable to Connect to MongoDB');
}   

var db = dbo.db('ToDoApp');

db.collection('Users').findOneAndUpdate(
    {
    name:'Name3'
    },
    {
        $set:{
            name:'Name1'
        },
        $inc:{
            age:1
        }
    },
    {
        returnOriginal:false
    }
).then((result)=>{
    console.log(result);
});

});