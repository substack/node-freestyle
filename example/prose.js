var freestyle = require('freestyle');
var fs = require('fs');

var s = fs.createReadStream(__dirname + '/qwantz.txt');

freestyle(s, function (rap) {
    var res = rap.prose(process.argv[2], 10);
    console.log(res.join(' '));
});
