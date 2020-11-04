import User from './User';

class Manager extends User {
  constructor(users, bookings, rooms) {
    super(users, bookings, rooms);
  }

  searchForGuest(name) {
    let guest = this.users.find(user => user.name === name);
    let currentBookings = this.bookings.filter(booking => {
      return booking.userID === guest.id;
    });
    let totalSpent = this.calculateTotalSpent(currentBookings);
    return {guest: guest.name, bookings: currentBookings, spent: totalSpent}
  }
}

export default Manager;