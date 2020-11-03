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


  bookARoom(roomNumber, date) {
    let findRoomToBook = this.rooms.find(room => room.number === roomNumber);
    this.bookings.push({
      "id": "5fwrgu4i7k55hl6sz",
      "userID": 1,
      "date": "2020/04/22",
      "roomNumber": roomNumber,
      "roomServiceCharges": []
    })
  }
}

export default User;