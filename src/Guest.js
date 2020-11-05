import User from './User';

class Guest extends User {
  constructor(users, bookings, rooms, currentUser) {
    super(users, bookings, rooms);
    this.users = users;
    this.bookings = bookings;
    this.rooms = rooms;
    this.currentUser = currentUser;
  }

  getCurrentBookings() {
    return this.findGuestsBooking(this.currentUser);
  }

  filterRoomByType(type, date) {
    let availableRooms = this.searchAvailability(date);
    let filteredRooms = availableRooms.filter(room => room.roomType === type);
    if (!filteredRooms.length) {
      return (`We are deeply sorry that we do not have any ${type}\s available`);
    } else {
      return filteredRooms;
    }
  }
}

export default Guest;