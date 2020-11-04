import User from './User';

class Guest extends User {
  constructor(users, bookings, rooms, id = null, name = null) {
    super(users, bookings, rooms);
    this.id = id;
    this.name = name;
  }
}

export default Guest;