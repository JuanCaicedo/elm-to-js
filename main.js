var vdom = require('virtual-dom')
var vh = require('virtual-dom/h');
var hh = require('hyperscript-helpers')(vh);
var main = require('main-loop')

var div   = hh.div;
var span  = hh.span;
var h1    = hh.h1;
var table = hh.table;
var tbody = hh.tbody;
var tr    = hh.tr;
var td    = hh.td;

var initialState =  {
  legislators: [{
    firstName: 'Juan',
    lastName: 'Caicedo'
  }, {
    firstName: 'Carson',
    lastName: 'Banov'
  }]
};
var loop = main(initialState, render, vdom)

document.querySelector('#content').appendChild(loop.target)

function legislatorTable(legislators) {
  return table('.table.table-striped', [
    tbody([
      tr([
        td(legislators[0].firstName),
        td(legislators[0].lastName)
      ]),
      tr([
        td(legislators[1].firstName),
        td(legislators[1].lastName)
      ])
    ])
  ]);

}

function render(state) {
  return div(legislatorTable(state.legislators));
}
