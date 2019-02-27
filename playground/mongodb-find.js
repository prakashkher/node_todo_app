const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017',(err,dbo)=>{
    var db = dbo.db('ToDoApp');
    var q = {name:"Name1"};
    db.collection('Users').find(q).toArray().then((users)=>{
        console.log('Users : ',JSON.stringify(users,undefined,2));
        console.log('Count of records : ',users.length);
    });

    db.collection('Users').find(q).count().then((count)=>{
        console.log('Count : ',count);
    });
});