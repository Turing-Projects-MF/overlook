import { expect } from 'chai';
import User from '../src/User';

describe('User', function() {
  let user;
  let users;
  let bookings;
  let rooms;

  beforeEach(function() {
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

    user = new User(users, bookings, rooms);
  });

  it('should be a function', function() {
    expect(User).to.be.a('function');
  });

  it('should be an instance of User', function() {
    expect(user).to.be.an.instanceof(User);
  });

  it('should only take in arrays as arguments', function() {
    expect(users, bookings, rooms).to.be.instanceof(Array);
  });

  it('should contain data for all users', function() {
    expect(user.users).to.deep.equal(users);
  });

  it('should contain data for all bookings', function() {
    expect(user.bookings).to.deep.equal(bookings);
  });

  it('should contain data for all rooms', function() {
    expect(user.rooms).to.deep.equal(rooms);
  });

  it('should be able to search availability by date', function() {

    expect(user.searchAvailability("2020/01/10")).to.deep.equal([rooms[0], rooms[3]]);
  });

  it('should be able to book a room', function() {
    user.bookARoom(1, users[0], "2020/01/10");
    let bookedRooms = [bookings[0], bookings[1], bookings[2], bookings[3], {
      "id": "5fwrgu4i7k55hl6t7",
      "userID": 1,
      "date": "2020/01/10",
      "roomNumber": 1,
      "roomServiceCharges": []
    }];

    expect(user.bookings).to.deep.equal(bookedRooms)
  });

  it('should return booked room', function() {
    expect(user.bookARoom(1, users[0], "2020/01/10")).to.deep.equal({
      "id": "5fwrgu4i7k55hl6t7",
      "userID": 1,
      "date": "2020/01/10",
      "roomNumber": 1,
      "roomServiceCharges": []
    })
  });

  it('should be able to remove a booking', function() {
    user.cancelBooking(bookings[3]);
    let bookedRooms = [bookings[0], bookings[1], bookings[2]];

    expect(user.bookings).to.deep.equal(bookedRooms);
  });

  it('should be able to return removed booking', function() {
    const bookedRoom = bookings[3];
    const cancelReservation = user.cancelBooking(bookings[3]);

    expect(cancelReservation).to.deep.equal(bookedRoom);
  });

  it('should calculate total spent', function() {
    expect(user.calculateTotalSpent(bookings)).to.equal(1756.36);
  });
});