var fs = require('fs');
var rhyme = require('rhyme');
var markov = require('markov');
var deck = require('deck');
var Seq = require('seq');

module.exports = function (stream, order, cb) {
    if (typeof order === 'function') {
        cb = order;
        order = 1;
    }
    
    var m = markov(order);
    
    Seq()
        .par(function () {
            rhyme(this.ok);
        })
        .par(function () {
            m.seed(stream, this);
        })
        .seq(function (r) {
            cb(methods(m, r));
        })
    ;
};

function methods (m, r) {
    function countSyllables (ws) {
        return ws.reduce(function (sum, w) {
            var s = r.syllables(w);
            if (s) return sum + s;
            var vs = w.match(/[aeiouy]+/ig);
            if (vs) return sum + vs.length;
            return sum;
        }, 0);
    }
    
    function fitSyllables (syllables, ws) {
        while (countSyllables(ws) < syllables) {
            var pick = m.pick();
            var res = m.respond(pick);
            ws.unshift.apply(ws, res);

        }
        
        while (countSyllables(ws) > syllables) {
            ws.shift();
        }
        
        return ws;
    }
    
    var self = { rhyme : r };
    
    self.prose = function (rhymeWith, syllables) {
        var rhymes = r.rhyme(rhymeWith || m.pick());
        
        while (rhymes.length === 0) {
            var p = m.pick();
            var rx = r.rhyme(p);
            if (rx.length) rhymes = [ p ]
        }
        
        var rh = deck.pick(rhymes);
        
        var words = m.backward(rh).concat(rh);
        if (syllables) words = fitSyllables(syllables, words);
        
        return words;
    };
    
    self.couplet = function (syllables) {
        var A = m.respond(m.pick());
        if (syllables) A = fitSyllables(syllables, A);
        
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
        
        var B = m.backward(rh).concat(rh);
        if (syllables) B = fitSyllables(syllables, B);
        
        return [ A.join(' '), B.join(' ') ];
    };
    
    return self;
}
