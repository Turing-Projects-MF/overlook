class User {
  constructor(users, bookings, rooms) {
    this.users = users;
    this.bookings = bookings;
    this.rooms = rooms;
  }

  searchAvailability(date) {
    //compare booking by date and return all rooms that are not booked
    //filter to return available rooms
    return this.bookings.filter(booking => booking.date !== date);
  }
}

export default User;