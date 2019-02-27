const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017',(err,dbo)=>{
    if(err){
        return console.log('Unable to connect to MongoDB');
    }
    var db = dbo.db('ToDoApp');

   /*  db.collection('Users').deleteMany({name:'Name1'}).then((result)=>{
        console.log(result.result);
    }); */

    db.collection('Users').findOneAndDelete({
        _id:new ObjectID('5c763c1f6fc46b1af0ebf370')
    }).then((result)=>{
        console.log(result);
    });
    dbo.close();
});