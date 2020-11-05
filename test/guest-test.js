import { expect } from 'chai';
import Guest from '../src/Guest';

describe('Guest', () => {
  let guest;
  let users;
  let bookings;
  let rooms;

  beforeEach(() => {
    users = [
      {
        "id": 1,
        "name": "Leatha Ullrich"
      },
      {
        "id": 2,
        "name": "Rocio Schuster"
      },
      {
        "id": 3,
        "name": "Kelvin Schiller"
      },
      {
        "id": 4,
        "name": "Kennedi Emard"
      }
    ];

    bookings = [
      {
        "id": "5fwrgu4i7k55hl6sz",
        "userID": 1,
        "date": "2020/04/22",
        "roomNumber": 1,
        "roomServiceCharges": []
      },
      {
        "id": "5fwrgu4i7k55hl6t5",
        "userID": 2,
        "date": "2020/01/10",
        "roomNumber": 2,
        "roomServiceCharges": []
      },
      {
        "id": "5fwrgu4i7k55hl6t6",
        "userID": 3,
        "date": "2020/01/10",
        "roomNumber": 3,
        "roomServiceCharges": []
      },
      {
        "id": "5fwrgu4i7k55hl6t7",
        "userID": 4,
        "date": "2020/02/16",
        "roomNumber": 4,
        "roomServiceCharges": []
      }
    ];

    rooms = [
      {
        "number": 1,
        "roomType": "residential suite",
        "bidet": true,
        "bedSize": "queen",
        "numBeds": 1,
        "costPerNight": 358.4
      },
      {
        "number": 2,
        "roomType": "suite",
        "bidet": false,
        "bedSize": "full",
        "numBeds": 2,
        "costPerNight": 477.38
      },
      {
        "number": 3,
        "roomType": "single room",
        "bidet": false,
        "bedSize": "king",
        "numBeds": 1,
        "costPerNight": 491.14
      },
      {
        "number": 4,
        "roomType": "single room",
        "bidet": false,
        "bedSize": "queen",
        "numBeds": 1,
        "costPerNight": 429.44
      }
    ];

    guest = new Guest(users, bookings, rooms, users[0]);
  })

  it('should be a function', () => {

    expect(Guest).to.be.a('function');
  });

  it('should be an instance of Guest', () => {

    expect(guest).to.be.an.instanceof(Guest);
  });

  it('should only take in arrays as arguments', () => {
    expect(users, bookings, rooms).to.be.instanceof(Array);
  });

  it('should have a list of all users', () => {
    expect(guest.users).to.deep.equal(users);
  });

  it('should have a list of all bookings', () => {
    expect(guest.bookings).to.deep.equal(bookings);
  });

  it('should have a list of all rooms', () => {
    expect(guest.rooms).to.deep.equal(rooms);
  });

  it('should have a current user', () => {
    expect(guest.currentUser).to.deep.equal(users[0]);
  });

  it('should get a current user\s bookings', () => {
    expect(guest.getCurrentBookings()).to.deep.equal([bookings[0]]);
  });

  it('should be able to filter room by type', () => {
    const filteredRoom = guest.filterRoomByType('single room');
    expect(filteredRoom).to.deep.equal([rooms[2], rooms[3]])
  });

  it('should apologize if there is room of that type available', () => {
    const filteredRoom = guest.filterRoomByType('penthouse');
    const message = `We are deeply sorry that we do not have any penthouse\s available`;

    expect(filteredRoom).to.equal(message);
  });
});