var fs = require('fs');
var rhyme = require('rhyme');
var markov = require('markov');
var deck = require('deck');
var Seq = require('seq');

module.exports = function (stream, cb) {
    var m = markov(1);
    
    Seq()
        .par(function () {
            rhyme(this.ok);
        })
        .par(function () {
            m.seed(stream, this);
        })
        .seq(function (r) {
            cb({
                couplet : couplet.bind(null, m, r)
            })
        });
    ;
};

function couplet (m, r) {
    var A = m.respond(m.pick(), 8);
    if (A.length <= 5) { // make longer with random padding
        A.unshift.apply(A, m.respond(m.pick(), 8 - A.length));
    }
    A.splice(0, A.length - 8);
    
    var pivot = A.slice(-1)[0].replace(/[^A-Za-z\d'-]/g, '');
    var rhymes = r.rhyme(pivot);
    
    var rh = rhymes && m.search(rhymes.join(' '));
    
    if (!rh) {
        rh = m.word(m.pick());
        var fixRhyme = r.rhyme(rh);
        if (fixRhyme.length) {
            A.push(deck.pick(fixRhyme).toLowerCase());
        }
    }
    
    var B = m.backward(rh, 8).concat(rh);
    if (B.length <= 5) { // make longer with random padding
        B.unshift.apply(B, m.respond('', 8 - B.length));
    }
    B.splice(0, B.length - 8);
    
    return [ A.join(' '), B.join(' ') ];
}
