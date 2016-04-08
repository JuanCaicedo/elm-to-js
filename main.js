var vdom = require('virtual-dom');
var vh = require('virtual-dom/h');
var hh = require('hyperscript-helpers')(vh);
var main = require('main-loop');
var R = require('ramda');
var EventEmitter = require('events');
var Task = require('data.task');
var $ = require('jquery');

var div   = hh.div;
var span  = hh.span;
var h1    = hh.h1;
var table = hh.table;
var tbody = hh.tbody;
var tr    = hh.tr;
var td    = hh.td;

var emitter = new EventEmitter();
var dataUrl = 'https://congress.api.sunlightfoundation.com/legislators';
var dataParams = {
  'apikey': 'd6ef0d61cbd241bc9d89109e4f70e128',
  'per_page': 'all'
};


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

function legislatorView(address, choice, legislator){
  return tr('.class', {
    onclick: function(ev) {
      address({
        type: 'Toggle',
        data: {
          type: choice,
          data: legislator
        }
      });
    }
  }, [
    td(legislator.firstName),
    td(legislator.lastName)
  ]);
}

function legislatorListView(address, choice, legislators) {
  _legislatorView = R.partial(legislatorView, [address, choice]);
  return table('.table.table-striped', [
    tbody(
      R.map(_legislatorView, legislators)
    )
  ]);
}

function legislatorSelectView(address, choice, title, legislators) {
  return div('.col-xs-6', [
    h1(title),
    legislatorListView(address, choice, legislators)
  ]);

}

function render(address, state) {
  return div('.container', [
    legislatorSelectView(address, 'Drop', 'Your Team', state.selectedLegislators),
    legislatorSelectView(address, 'Select', 'Available', state.availableLegislators)
  ]);
}

function update(state, action) {
  // fallback case
  var newState = state;
  var newSelected;
  var newAvailable;

  if (action.type === 'Toggle') {
    if (action.data.type === 'Drop') {
      newSelected = R.reject(R.equals(action.data.data), state.selectedLegislators);
      newAvailable = R.append(action.data.data, state.availableLegislators);

      newState = R.merge(state, {
        selectedLegislators: newSelected,
        availableLegislators: newAvailable
      });
    } else if (action.data.type === 'Select') {
      newSelected = R.append(action.data.data, state.selectedLegislators);
      newAvailable = R.reject(R.equals(action.data.data), state.availableLegislators);

      newState = R.merge(state, {
        selectedLegislators: newSelected,
        availableLegislators: newAvailable
      });
    }
  }
  return newState;
}

function address(action) {
  emitter.emit('update', action);
};

function getJSON(url, params) {
  return new Task(function(reject, result) {
    $.getJSON(url, params, result).fail(reject);
  });
};

// request(dataUrl, dataParams, function(err, data) {
//   console.log(err);
// });

var jsonTask = getJSON(dataUrl, dataParams);
jsonTask.fork(
  function(error) {
    console.log('error', error);
  },
  function(data) {
    console.log('data', data);
  }
);
var renderFunction = R.partial(render, [address]);
var loop = main(initialState, renderFunction, vdom);

document.querySelector('#content').appendChild(loop.target);
emitter.on('update', function(action) {
  var newState = update(loop.state, action);
  loop.update(newState);
});
