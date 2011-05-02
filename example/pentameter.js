var freestyle = require('freestyle');
var fs = require('fs');

var s = fs.createReadStream(__dirname + '/qwantz.txt');

freestyle(s, function (rap) {
    var A = rap.couplet(10);
    var B = rap.couplet(10);
    
    console.log([
        A[0], B[0], A[1], B[1], ''
    ].join('\n'));
});
