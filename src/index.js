import './css/base.scss';
import './css/base.scss';
import User from './User';
import apiRequest from './api-request';

var modal = document.getElementById('id01');

let usersData;
let roomsData;
let bookingsData;
let user;

let recievedUsersData = apiRequest.getUsersData();
let recievedRoomsData = apiRequest.getRoomsData();
let recievedBookingsData = apiRequest.getBookingsData();

Promise.all([recievedUsersData, recievedRoomsData, recievedBookingsData])
  .then(value => {
    usersData = value[0];
    roomsData = value[1];
    bookingsData = value[2];
    createUser();
  })


window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


function createUser() {
  user = new User(usersData, bookingsData, roomsData)
}
