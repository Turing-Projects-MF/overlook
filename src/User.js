class User {
  constructor(users, bookings, rooms) {
    this.users = users;
    this.bookings = bookings;
    this.rooms = rooms;
  }

  searchAvailability(date) {
    const bookedRoomsOnDate = this.findBookedRooms(date);
    const availableRoomsOnDate = this.filterBookedRooms(bookedRoomsOnDate);
    return availableRoomsOnDate;
  }

  findBookedRooms(date) {
    return this.bookings.reduce((totalBookings, booking) => {
      booking.date === date ? totalBookings.push(booking.roomNumber) : null
      return totalBookings
    }, []);
  }

  filterBookedRooms(bookedRooms) {
    return this.rooms.filter(room => !bookedRooms.includes(room.number));
  }

  //don't need bookARoom
  bookARoom(roomNumber, user, date) {
    const roomToBook = this.rooms.find(room => room.number === roomNumber);
    this.bookings.push({
      "userID": user.id,
      "date": date,
      "roomNumber": roomToBook.number
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
    const expense = bookingsData.reduce((totalSpent, booking) => {
      this.rooms.forEach(room => {
        room.number === booking.roomNumber ? totalSpent += room.costPerNight : null;
      })
      return totalSpent;
    }, 0)
    return Math.round(expense * 100) / 100;
  }

  findGuestsBooking(guest) {
    return this.bookings.filter(booking => {
      return booking.userID === guest.id;
    });
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

  findBookingToDelete(bookingID) {
    return  this.bookings.find(booking => {
      return booking.id === bookingID;
    })
  }
}

export default User;