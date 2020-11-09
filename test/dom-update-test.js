import domUpdate from '../src/dom-update';

const chai = require('chai');
const spies = require('chai-spies');

chai.use(spies);

const expect = chai.expect;

describe('domUpdate', () => {
  let rooms;
  let guest;
  let htmlTag;
  let user;
  let searchValue;

  before(() => {
    global.domUpdate = {};
    chai.spy.on(domUpdate, [
      'clearBookingsDetails',
      'displaySearchResults',
      'displayGuestBookings',
      'displaySearchUserDetails'
    ], () => {})
  });

  after(() => {
    chai.spy.restore(domUpdate)
  })

  beforeEach(() => {
    rooms = [];
    guest = {};
    htmlTag = '';
    user = {};
    searchValue = '';
  });

  it('should clear booking details html', () => {
    domUpdate.clearBookingsDetails();

    expect(domUpdate.clearBookingsDetails).to.have.been.called(1);
    expect(domUpdate.clearBookingsDetails).to.have.been.called.with()
  });

  it('should display search results for a room', () => {
    domUpdate.displaySearchResults(rooms);

    expect(domUpdate.displaySearchResults).to.have.been.called(1);
    expect(domUpdate.displaySearchResults).to.have.been.called.with(rooms);
  });

  it('should display a guest\'s bookings', () => {
    domUpdate.displayGuestBookings(guest, htmlTag);

    expect(domUpdate.displayGuestBookings).to.have.been.called(1);
    expect(domUpdate.displayGuestBookings).to.have.been.called.with(guest, htmlTag);
  });

  it('should display rooms available to book', () => {
    domUpdate.displaySearchUserDetails(user, searchValue);

    expect(domUpdate.displaySearchUserDetails).to.have.been.called(1);
    expect(domUpdate.displaySearchUserDetails).to.have.been.called.with(user, searchValue);
  })
})