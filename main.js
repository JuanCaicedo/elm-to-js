var vdom = require('virtual-dom')
var vh = require('virtual-dom/h');
var hh = require('hyperscript-helpers')(vh);
var main = require('main-loop')
var R = require('ramda');

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

function legislatorView(legislator){
  return tr([
    td(legislator.firstName),
    td(legislator.lastName)
  ]);
}

function legislatorTable(legislators) {
  return table('.table.table-striped.col-xs-6', [
    tbody(
      R.map(legislatorView, legislators)
    )
  ]);

}

function render(state) {
  return div('.container', legislatorTable(state.legislators));
}
