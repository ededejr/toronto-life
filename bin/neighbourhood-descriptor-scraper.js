const request = require('request');
const cheerio = require('cheerio');

const url = 'https://www.blogto.com/neighborhoods/';

request(url, function(err, res, html){

    if (err) {
        console.log(`Something wen't wrong:\n ${err}`);
        return;
    }

    const $ = cheerio.load(html);

    let listOfneighborhoods = $('.listing-neighborhood-box').toArray();

    listOfneighborhoods = listOfneighborhoods.map(n => {
        n = cheerio(n);
        const r = new RegExp(`\\'`, "g");
        return {
            src: n.find('img').attr('src'),
            desc: n.find('.listing-neighborhood-blurb').text().trim().replace(/\n/g, '').replace(r, `'`),
            name: n.find('.listing-neighborhood-name').text().trim().replace(/\n/g, '').replace(r, `'`)
        }
    });

    console.log(listOfneighborhoods);


})