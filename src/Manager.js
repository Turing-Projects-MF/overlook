import User from './User';

class Manager extends User {
  constructor(users, bookings, rooms) {
    super(users, bookings, rooms);
  }

  getTodaysRevenue(date) {
    let todaysBookedRooms = this.findBookedRooms(date);
    return this.rooms.reduce((totalRevenue, room) => {
      todaysBookedRooms.includes(room.number) ? totalRevenue += room.costPerNight : null;
      return totalRevenue
    }, 0)
  }

  getPercentOccupied(date) {
    let todaysBookedRooms = this.findBookedRooms(date);
    return todaysBookedRooms.length / this.rooms.length;
  }
}

export default Manager;