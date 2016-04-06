var vdom = require('virtual-dom')
var vh = require('virtual-dom/h');
var hh = require('hyperscript-helpers')(vh);
var main = require('main-loop')

var div  = hh.div;
var span = hh.span;
var h1   = hh.h1;

var loop = main({ times: 0 }, render, vdom)

document.querySelector('#content').appendChild(loop.target)

function render(state) {
  return h1('title juan');
}
