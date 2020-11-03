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
    const reservation = this.bookings.find(booking => booking === bookedRoom);
    this.bookings.forEach(booking => {
      if (booking === reservation) {
        this.bookings.splice(reservation, 1);
      }
    })
    return reservation;
  }
  calculateTotalSpent(bookingsData) {
    let expense = bookingsData.reduce((totalSpent, booking) => {
      this.rooms.forEach(room => {
        room.number === booking.roomNumber ? totalSpent += room.costPerNight : null;
      })
      return totalSpent
    }, 0)
    return Math.round(expense * 100) / 100
  }
}

export default User;