var expect = require('chai').expect;
var stateless = require('../src/stateless');
var legislatorView = stateless.legislatorView;

describe('legislatorView', function() {

  var noopAddress = function(){};

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
