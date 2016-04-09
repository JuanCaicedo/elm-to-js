var expect = require('chai').expect;
var stateless = require('../src/stateless');
var legislatorView = stateless.legislatorView;
var legislatorListView = stateless.legislatorListView;
var update = stateless.update;

var noopAddress = function(){};

var juan = {
  firstName: 'Juan',
  lastName: 'Caicedo'
};

var carson = {
  firstName: 'Carson',
  lastName: 'Banov'
};

describe('legislatorView', function() {

  it('returns a row', function() {
    var view = legislatorView(noopAddress, 'test', {});
    expect(view).to.have.property('tagName', 'TR');
  });

  it('returns two children', function() {
    var view = legislatorView(noopAddress, 'test', {});

    expect(view).to.have.property('children')
      .and.to.have.length(2);
  });

  it('has a firstName cell', function() {
    var legislator = {
      firstName: 'Juan'
    };

    var view = legislatorView(noopAddress, 'test', legislator);
    var firstChild = view.children[0];

    expect(firstChild).to.have.property('tagName', 'TD');
    expect(firstChild).to.have.deep.property('children[0]')
      .and.to.have.property('text', 'Juan');
  });

  it('has a lastName cell', function() {
    var legislator = {
      lastName: 'Caicedo'
    };

    var view = legislatorView(noopAddress, 'test', legislator);
    var firstChild = view.children[1];

    expect(firstChild).to.have.property('tagName', 'TD');
    expect(firstChild).to.have.deep.property('children[0]')
      .and.to.have.property('text', 'Caicedo');
  });

  it('has onclick handler', function() {
    var view = legislatorView(noopAddress, 'test', {});

    expect(view).to.have.deep.property('properties.onclick')
      .and.to.be.a('function');
  });

});

describe('legislatorListView', function() {

  it('returns a row per legislator', function() {
    var legislators = [{}, {}, {}];
    var view = legislatorListView(noopAddress, 'test', legislators);

    expect(view).to.have.deep.property('.children[0].children')
      .and.to.have.length(3);
  });

});

describe('update', function() {

  describe('with Toggle Drop', function() {

    it('moves legislator from Selected to Available', function() {
      var state = {
        availableLegislators: [],
        selectedLegislators: [juan, carson]
      };

      var newState = update(state, {
        type: 'Toggle',
        data: {
          type: 'Drop',
          data: juan
        }
      });

      expect(newState).to.have.property('availableLegislators')
        .and.to.deep.eql([juan]);
      expect(newState).to.have.property('selectedLegislators')
        .and.to.deep.eql([carson]);
    });

  });

  describe('with Toggle Select', function() {

    it('moves legislator from Selected to Available', function() {
      var state = {
        availableLegislators: [juan],
        selectedLegislators: [carson]
      };

      var newState = update(state, {
        type: 'Toggle',
        data: {
          type: 'Select',
          data: juan
        }
      });

      expect(newState).to.have.property('availableLegislators')
        .and.to.deep.eql([]);
      expect(newState).to.have.property('selectedLegislators')
        .and.to.deep.eql([carson, juan]);
    });

  });

  describe('with PopulateAvailableLegislators Success', function() {

    it('adds legislator to available', function() {

      var state = {
        availableLegislators: [],
        selectedLegislators: []
      };

      var newState = update(state, {
        type: 'PopulateAvailableLegislators',
        data: {
          type: 'Success',
          data: [juan, carson]
        }
      });

      expect(newState).to.have.property('availableLegislators')
        .and.to.deep.eql([juan, carson]);
      expect(newState).to.have.property('selectedLegislators')
        .and.to.deep.eql([]);
    });

  });

  // describe('with PopulateAvailableLegislators Error', function() {

  //   it('adds legislator to available', function() {

  //     var state = {
  //       availableLegislators: [],
  //       selectedLegislators: []
  //     };

  //     var newState = update(state, {
  //       type: 'PopulateAvailableLegislators',
  //       data: {
  //         type: 'Success',
  //         data: [juan, carson]
  //       }
  //     });

  //     expect(newState).to.have.property('availableLegislators')
  //       .and.to.deep.eql([juan, carson]);
  //     expect(newState).to.have.property('selectedLegislators')
  //       .and.to.deep.eql([]);
  //   });

  // });

});
