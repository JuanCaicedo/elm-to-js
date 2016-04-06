var vdom = require('virtual-dom');
var vh = require('virtual-dom/h');
var hh = require('hyperscript-helpers')(vh);
var main = require('main-loop');
var R = require('ramda');

var div   = hh.div;
var span  = hh.span;
var h1    = hh.h1;
var table = hh.table;
var tbody = hh.tbody;
var tr    = hh.tr;
var td    = hh.td;

var initialState =  {
  availableLegislators: [{
    firstName: 'Senator',
    lastName: 'One'
  }, {
    firstName: 'Congresswoman',
    lastName: 'Two'
  }],
  selectedLegislators: [{
    firstName: 'Juan',
    lastName: 'Caicedo'
  }, {
    firstName: 'Carson',
    lastName: 'Banov'
  }]
};

function legislatorView(legislator){
  return tr([
    td(legislator.firstName),
    td(legislator.lastName)
  ]);
}

function legislatorListView(legislators) {
  return table('.table.table-striped', [
    tbody(
      R.map(legislatorView, legislators)
    )
  ]);
}

function legislatorSelectView(title, legislators) {
  return div('.col-xs-6', [
    h1(title),
    legislatorListView(legislators)
  ]);

}

function render(state) {
  return div('.container', [
    legislatorSelectView('Your Team', state.selectedLegislators),
    legislatorSelectView('Available', state.availableLegislators)
  ]);
}

var loop = main(initialState, render, vdom);

document.querySelector('#content').appendChild(loop.target);
