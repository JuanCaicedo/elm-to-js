var vdom = require('virtual-dom');
var vh = require('virtual-dom/h');
var hh = require('hyperscript-helpers')(vh);
var main = require('main-loop');
var R = require('ramda');
var EventEmitter = require('events');
var emitter = new EventEmitter();


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

function legislatorView(address, legislator){
  return tr('.class', {
    onclick: function(ev) {
      address({
        type: 'Toggle',
        data: legislator
      });
    }
  }, [
    td(legislator.firstName),
    td(legislator.lastName)
  ]);
}

function legislatorListView(address, legislators) {
  _legislatorView = R.partial(legislatorView, [address]);
  return table('.table.table-striped', [
    tbody(
      R.map(_legislatorView, legislators)
    )
  ]);
}

function legislatorSelectView(address, title, legislators) {
  return div('.col-xs-6', [
    h1(title),
    legislatorListView(address, legislators)
  ]);

}

function render(address, state) {
  return div('.container', [
    legislatorSelectView(address, 'Your Team', state.selectedLegislators),
    legislatorSelectView(address, 'Available', state.availableLegislators)
  ]);
}

function update(state, action) {
  return {
    availableLegislators: [{
      firstName: 'test',
      lastName: 'One'
    }, {
      firstName: 'test',
      lastName: 'Two'
    }],
    selectedLegislators: [{
      firstName: 'test',
      lastName: 'Caicedo'
    }, {
      firstName: 'test',
      lastName: 'Banov'
    }]
  };
}

function address(action) {
  emitter.emit('update', action);
};

var renderFunction = R.partial(render, [address]);
var loop = main(initialState, renderFunction, vdom);

document.querySelector('#content').appendChild(loop.target);
emitter.on('update', function(action) {
  var newState = update(loop.state, action);
  loop.update(newState);
});
