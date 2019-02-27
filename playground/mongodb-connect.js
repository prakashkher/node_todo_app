const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017',(err,dbo)=>{
    if(err){
        console.log('Unable to connect to MongoDB.',err);
        return;
    }
    console.log('Connected to MongoDB');
db = dbo.db('ToDoApp');

db.collection('Users').insertOne({
  name:'Name1',
  age:10,
  location:'location1' 
},(err,res)=>{
    if(err){
        return console.log('Unable to insert User',err);
    }
    console.log('Saved User :',JSON.stringify(res.ops));
});

dbo.close();
});