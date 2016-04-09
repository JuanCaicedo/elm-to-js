var vdom = require('virtual-dom');
var EventEmitter = require('events');
var R = require('ramda');
var mainLoop = require('main-loop');

var stateless = require('./src/stateless.js');
var render = stateless.render;
var getJSON = stateless.getJSON;
var update = stateless.update;
var decodeLegislator = stateless.decodeLegislator;

/* Constants */
var dataUrl = 'https://congress.api.sunlightfoundation.com/legislators';
var dataParams = {
  'apikey': 'd6ef0d61cbd241bc9d89109e4f70e128',
  'per_page': 'all'
};

/* Initial state */
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

var emitter = new EventEmitter();

function address(action) {
  emitter.emit('update', action);
};

function main() {
  var renderFunction = R.partial(render, [address]);
  var loop = mainLoop(initialState, renderFunction, vdom);

  var jsonTask = getJSON(dataUrl, dataParams);

  document.querySelector('#content').appendChild(loop.target);
  emitter.on('update', function(action) {
    var newState = update(loop.state, action);
    loop.update(newState);
  });

  jsonTask.fork(
    function(error) {
      address({
        type: 'PopulateAvailableLegislators',
        data: {
          type: 'Error',
          data: error
        }
      });
    },
    function(response) {
      address({
        type: 'PopulateAvailableLegislators',
        data: {
          type: 'Success',
          data: R.map(decodeLegislator, response.results)
        }
      });
    }
  );
}

main();
