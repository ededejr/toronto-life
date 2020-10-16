const Mongo = require('mongodb').MongoCLient;
const URL = 'mongodb://localhost:4545/';

Mongo.connect(URL, {useNewUrlParser: true}, function(err, db) {
  if (err) {
    throw err;
  }

  const todb = db.db('torontolife');
  
  // Just dummy data for now
  const data = [
    {
      name: 'Rosedale',
      prop: 'Money over everything'
    }
  ];

  todb.collection('neighborhoods').insertMany(data, function(err, res) {
    if (err) throw err;
    console.log(res);
    console.log(`${res.insertedCount} documents inserted.`);

    db.close();
  })
});