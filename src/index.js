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
const searchGuestInput = document.querySelector('#search-guest');
const managerGuestBookings =  document.querySelector('.body__manager__user__section');
const guestBookings =  document.querySelector('.body__guest__user__section');


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
searchGuestInput.addEventListener('keyup', displayManagerSearchResults);

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

function checkUsername() {
  const username = loginUsername.value;
  let validName;
  usersData.forEach(user => {
    if (username === `customer${user.id}`) {
      validName = true;
    }
  })
  if (username === 'manager' || validName) {
    return true;
  } else {
    return false
  }
}


function checkPassword() {
  const password = loginPassword.value;
  if (password === 'overlook2020') {
    return true
  } else {
    return false
  }
}

function displayDashboard(e) {
  e.preventDefault();
  if (!checkPassword() || !checkUsername()) {
    alert ('You username and password did not match our system. Please re-enter');
    return
  }
  if (loginUsername.value === 'manager') {
    createManager();
    displayManagerDashboard("2020/04/22");
  } else if (loginUsername.value.includes('customer')) {
    createGuest();
    displayGuestDashboard();
  }
}

function createGuest() {
  usersData.forEach(user => {
    if (loginUsername.value === `customer${user.id}`) {
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

function displayManagerDashboard(date) {
  managerDashboard.classList.remove('hidden');
  bodyLogin.classList.add('hidden');
  displayAvailableRooms(date);
  displayTodaysRevenue(date);
  displayPercentOccupied(date);
}

function displayGuestDashboard() {
  main.classList.remove('hidden');
  guestBookingview.classList.remove('hidden');
  bodyLogin.classList.add('hidden');
  displaySearchUserBookings(guest.currentUser.name, 'guest', guestBookings);
  displayGuestTotalSpent();
}

function displayAvailableRooms(date) {
  const availableRooms = manager.searchAvailability(date);
  document.querySelector('.body__manager__available__rooms').innerText = `${availableRooms.length}`;
}

function displayTodaysRevenue(date) {
  const totalRevenue =  manager.getTodaysRevenue(date);
  document.querySelector('.body__manager__total__revenue').innerText = `$${totalRevenue}`;
}

function displayPercentOccupied(date) {
  let totalPercent = manager.getPercentOccupied(date) * 100;
  document.querySelector('.body__manager__total__percent').innerText = `${totalPercent}%`;
}

function displayManagerSearchResults(e) {
  if (e.key === 'Enter') {
    displaySearchUserDetails();
    displaySearchUserBookings(searchGuestInput.value, 'manager', managerGuestBookings);
  }
}

function displaySearchUserDetails() {
  const guest = manager.searchForGuest(searchGuestInput.value);
  const guestDetails = `
  <article class="body__manager__user__wrapper__article" id="manager-guest-name">${guest.guest}</article>
  <article class="body__manager__user__wrapper__article" id="manager-guest-spent">$${guest.spent}</article>
  `;
  document.querySelector('.body__manager__user__wrapper').innerHTML = guestDetails;
}

function displaySearchUserBookings(name, htmlTag, selector) {
  const guestDetails = formatUserBookings(name);
  const displayGuestBookings = guestDetails.reduce((displayHTML, guest) => {
    //add Bookings to top of display
    displayHTML += `
      <article class="body__${htmlTag}__user__booking">
            ${guest.bookedDate} ${guest.roomNumber} ${guest.roomType} ${guest.costPerNight}
       </article>
          `;
    return displayHTML;
  }, '')
  selector.innerHTML = displayGuestBookings;
}

function formatUserBookings(name) {
  const userDetails = user.searchForGuest(name);
  return userDetails.bookings.reduce((formatDetails, booking) => {
    let format = {};
    format.bookedDate = booking.date;
    format.roomNumber = booking.roomNumber;
    user.rooms.forEach(room => {
      if (room.number === booking.roomNumber) {
        format.roomType = room.roomType;
        format.costPerNight = room.costPerNight;
      }
    })
    formatDetails.push(format);
    return formatDetails.sort((a, b) => a.bookedDate > b.bookedDate ? -1 : 1);
  }, [])
}

function displayGuestTotalSpent() {
  const totalSpent = guest.calculateTotalSpent(guest.bookings);
  document.querySelector('.main__guest__wrapper__article').innerText = `$${totalSpent}`;
}
