var vh = require('virtual-dom/h');
var hh = require('hyperscript-helpers')(vh);
var R = require('ramda');
var Task = require('data.task');
var $ = require('jquery');

var div   = hh.div;
var span  = hh.span;
var h1    = hh.h1;
var table = hh.table;
var tbody = hh.tbody;
var tr    = hh.tr;
var td    = hh.td;

var action = function(type, data) {
  return {
    type: type,
    data: data
  };
};

var legislatorView = R.curry(function (address, choice, legislator) {
  return tr('.container-fluid', {
    onclick: function(ev) {
      address(action('Toggle', action(choice, legislator)));
    }
  }, [
    td('.col-xs-6', legislator.firstName),
    td('.col-xs-6', legislator.lastName)
  ]);
});

var legislatorTableView = function (address, choice, title, legislators) {
  return div('.col-xs-6', [
    h1(title),
    table('.table.table-striped', [
      tbody(
        R.map(legislatorView(address, choice), legislators)
      )
    ])
  ]);
};

var render = R.curry(function (address, state) {
  return div('.container', [
    legislatorTableView(address, 'Drop', 'Your Team', state.selectedLegislators),
    legislatorTableView(address, 'Select', 'Available', state.availableLegislators)
  ]);
});

var update = function (state, action) {
  var newSelected;
  var newAvailable;

  // fallback case
  var newState = state;

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
  } else if (action.type === 'PopulateAvailableLegislators') {
    if (action.data.type === 'Success') {
      newState = R.merge(state, {
        availableLegislators: action.data.data
      });
    } else if (action.data.type === 'Error') {
      console.log('Error', error);
    }
  }
  return newState;
};

var getJSON = function (url, params) {
  return new Task(function(reject, result) {
    $.getJSON(url, params, result).fail(reject);
  });
};

var decodeLegislator = function (legislator) {
  return {
    firstName: legislator.first_name,
    lastName: legislator.last_name
  };
};

var fetchLegislators = function(address, jsonTask) {
  jsonTask.fork(
    function(error) {
      address(
        action(
          'PopulateAvailableLegislators',
          action(
            'Error',
            error
          )
        )
      );
    },
    function(response) {
      address(
        action(
          'PopulateAvailableLegislators',
          action(
            'Success',
            R.map(decodeLegislator, response.results)
          )
        )
      );
    }
  );
};


module.exports = {
  legislatorView: legislatorView,
  legislatorTableView: legislatorTableView,
  render: render,
  update: update,
  getJSON: getJSON,
  fetchLegislators: fetchLegislators,
  decodeLegislator: decodeLegislator
};
