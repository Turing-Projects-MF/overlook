class User {
  constructor(users, bookings, rooms) {
    this.users = users;
    this.bookings = bookings;
    this.rooms = rooms;
  }

  searchAvailability(date) {
    let bookedRooms = this.bookings.reduce((totalBookings, booking) => {
      booking.date === date ? totalBookings.push(booking.roomNumber) : null
      return totalBookings
    }, []);
    return this.rooms.filter(room => !bookedRooms.includes(room.number));
  }

  bookARoom(roomNumber, user, date) {
    let roomToBook = this.rooms.find(room => room.number === roomNumber);
    this.bookings.push({
      "id": "5fwrgu4i7k55hl6t7",
      "userID": user.id,
      "date": date,
      "roomNumber": roomToBook.number,
      "roomServiceCharges": []
    });
    return this.bookings[this.bookings.length - 1];
  }

  cancelBooking(bookedRoom) {
    let reservation = this.bookings.find(booking => booking === bookedRoom);
    return this.bookings.forEach(booking => {
      if (booking === reservation) {
        this.bookings.splice(reservation, 1);
      }
    })
  }
}

export default User;