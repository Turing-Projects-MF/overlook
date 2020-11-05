import './css/base.scss';
import './css/base.scss';
import User from './User';
import Guest from './Guest';
import Manager from './Manager';
import apiRequest from './api-request';

const modal = document.getElementById('id01');
const bodyLogin = document.querySelector('.body__login');
const fadeIn = document.querySelector('.fade-in');
const loginUsername = document.querySelector('#login-username');
const loginPassword = document.querySelector('#login-password');
const loginButton= document.querySelector('.login-button');
const managerDashboard = document.querySelector('.body__manager ');
const main = document.querySelector('main');
const guestBookingview = document.querySelectorAll('.body__guest__user__view')[1];

let usersData;
let roomsData;
let bookingsData;
let user;
let guest;
let manager;

let recievedUsersData = apiRequest.getUsersData();
let recievedRoomsData = apiRequest.getRoomsData();
let recievedBookingsData = apiRequest.getBookingsData();


fadeIn.addEventListener('animationend', displayLogin);
loginButton.addEventListener('click', displayDashboard);

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
  user = new User(usersData, bookingsData, roomsData);
}

function displayLogin() {
  bodyLogin.classList.remove('hidden');
}

function displayDashboard(e) {
  e.preventDefault();
  bodyLogin.classList.add('hidden');
  if (loginUsername.value.includes('manager')) {
    managerDashboard.classList.remove('hidden');
    createManager();
    displayAvailableRooms("2020/04/22");
    displayTodaysRevenue("2020/04/22");
    displayPercentOccupied("2020/04/22");
  } else if (loginUsername.value.includes('customer')) {
    main.classList.remove('hidden');
    guestBookingview.classList.remove('hidden');
    createGuest();
  }
}

function createGuest() {
  usersData.forEach(user => {
    if (loginUsername.value === `customer${user.id}` && loginPassword.value === 'overlook2020') {
      guest = new Guest(usersData, bookingsData, roomsData, user);
      guest.bookings = createGuestBookings(guest);
    }
  })
}

function createGuestBookings(guest) {
  return bookingsData.filter(booking => {
    return booking.userID === guest.currentUser.id;
  })
}

function createManager() {
  if (loginUsername.value === `manager` && loginPassword.value === 'overlook2020')  {
    manager = new Manager(usersData, bookingsData, roomsData);
  }
}

function displayAvailableRooms(date) {
  const availableRooms = manager.searchAvailability(date);
  document.querySelector('.body__manager__available__rooms').innerText = `${availableRooms.length}`;
}

function displayTodaysRevenue(date) {
  const totalRevenue = manager.getTodaysRevenue(date);
  document.querySelector('.body__manager__total__revenue').innerText = `${totalRevenue}`;
}

function displayPercentOccupied(date) {
  let totalPercent = manager.getPercentOccupied(date) * 100;
  document.querySelector('.body__manager__total__percent').innerText = `${totalPercent}%`;
}