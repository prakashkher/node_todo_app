const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.MONGDB_URI || 'mongodb://localhost:27017/ToDoApp');

module.exports={mongoose};