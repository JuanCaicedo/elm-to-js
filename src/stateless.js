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

var legislatorView = function (address, choice, legislator) {
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
};

var legislatorListView = function (address, choice, legislators) {
  _legislatorView = R.partial(legislatorView, [address, choice]);
  return table('.table.table-striped', [
    tbody(
      R.map(_legislatorView, legislators)
    )
  ]);
};

var legislatorSelectView = function (address, choice, title, legislators) {
  return div('.col-xs-6', [
    h1(title),
    legislatorListView(address, choice, legislators)
  ]);

};

var render = function (address, state) {
  return div('.container', [
    legislatorSelectView(address, 'Drop', 'Your Team', state.selectedLegislators),
    legislatorSelectView(address, 'Select', 'Available', state.availableLegislators)
  ]);
};

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

module.exports = {
  legislatorView: legislatorView,
  legislatorListView: legislatorListView,
  legislatorSelectView: legislatorSelectView,
  render: render,
  update: update,
  getJSON: getJSON,
  decodeLegislator: decodeLegislator
};
