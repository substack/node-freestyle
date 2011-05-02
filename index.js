var fs = require('fs');
var rhyme = require('rhyme');
var markov = require('markov');
var deck = require('deck');
var Seq = require('seq');

var m = markov(1);

Seq()
    .par(function () {
        rhyme(this.ok);
    })
    .par(function () {
        var s = fs.createReadStream(__dirname + '/qwantz.txt');
        m.seed(s, this);
    })
    .seq(function (r) {
        for (var i = 0; i < 5; i++) {
            var A = couplet(r);
            var B = couplet(r);
            
            [ A[0], B[0], A[1], B[1] ].forEach(function (x) {
                console.log(x);
            });
            console.log();
        }
    })
;

function couplet (r) {
    var A = m.respond(m.pick(), 12);
    
    var pivot = A.slice(-1)[0].replace(/[^A-Za-z\d'-]/g, '');
    var rhymes = r.rhyme(pivot);
    
    var rh = rhymes && m.search(rhymes.join(' '));
    
    if (!rh) {
        rh = m.pick();
        var fixRhyme = r.rhyme(rh);
        if (fixRhyme.length) {
            A.push(deck.pick(fixRhyme).toLowerCase());
        }
    }
    
    var B = m.backward(rh, 12).concat(rh);
    
    return [ A.join(' '), B.join(' ') ];
}
