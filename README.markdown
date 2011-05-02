freestyle
=========

Really terrible freestyle rhyming markov rap generation

examples
========

rap.js
------

    var freestyle = require('freestyle');
    var fs = require('fs');

    var s = fs.createReadStream(__dirname + '/qwantz.txt');

    freestyle(s, function (rap) {
        var A = rap.couplet();
        var B = rap.couplet();
        
        console.log([
            A[0], B[0], A[1], B[1], ''
        ].join('\n'));
    });

output:

    $ node examples/rap.js
    house up as a a rare rare pleasure kernes
    require extraordinary Extraordinary claims claims require require extraordinary
    bull
    out there is a part of it turns
    REMEMBER it turns out of the future full
