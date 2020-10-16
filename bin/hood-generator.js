
const db = require('./processedData/neighborhoods.json');

const hoodNumbers = Object.keys(db);

console.log(db[hoodNumbers[0]])

console.log(db[hoodNumbers[5]])

/*
hoodNumbers.forEach(num => {
  let hood = db[num];
  console.log(hood.name);
})*/
