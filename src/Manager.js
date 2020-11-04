import User from './User';

class Manager extends User {
  constructor(users, bookings, rooms) {
    super(users, bookings, rooms);
  }

  searchForGuest(name) {
    let guest = this.findGuestByName(name);
    let currentBookings = this.findGuestsBooking(guest);
    let totalSpent = this.calculateTotalSpent(currentBookings);
    return {
      guest: guest.name,
      bookings: currentBookings,
      spent: totalSpent
    }
  }

  findGuestByName(name) {
    return this.users.find(user => user.name === name);
  }
}

export default Manager;