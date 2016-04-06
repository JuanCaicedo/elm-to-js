var vdom = require('virtual-dom')
var vh = require('virtual-dom/h');
var hh = require('hyperscript-helpers')(vh);
var main = require('main-loop')

var div   = hh.div;
var span  = hh.span;
var h1    = hh.h1;
var table = hh.table;
var tr    = hh.tr;
var td    = hh.td;

var initialState =  {
  firstName: 'Juan',
  lastName: 'Caicedo'
};
var loop = main(initialState, render, vdom)

document.querySelector('#content').appendChild(loop.target)

function render(state) {
  return table([
    tr([
      td(state.firstName),
      td(state.lastName)
    ])
  ]);
}
