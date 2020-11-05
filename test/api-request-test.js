import apiRequest from '../src/api-request';

const chai = require('chai');
const spies = require('chai-spies');

chai.use(spies);

const expect = chai.expect;

describe('apiRequest', () => {

  before(() => {
    global.apiRequest = {};
    chai.spy.on(apiRequest, ['getUsersData', 'getRoomsData', 'getBookingsData'], () => {});
  });

  it('should be able to fetch data for all users', () => {
    apiRequest.getUsersData();

    expect(apiRequest.getUsersData).to.have.been.called(1);
    expect(apiRequest.getUsersData).to.have.been.called.with();
  });

  it('should be able to fetch data for all rooms', () => {
    apiRequest.getRoomsData();

    expect(apiRequest.getRoomsData).to.have.been.called(1);
    expect(apiRequest.getRoomsData).to.have.been.called.with();
  });

  it('should be able to fetch data for all bookings', () => {
    apiRequest.getBookingsData();

    expect(apiRequest.getBookingsData).to.have.been.called(1);
    expect(apiRequest.getBookingsData).to.have.been.called.with();
  });
})