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
const guestBookingsTitle = document.querySelector('#bookings-title');
const dateSubmitButton = document.querySelector('.date-submit');
const dateValue = document.querySelector('#date-search');
const calendar = document.querySelector('.calendar');
const filterButtons = document.getElementsByClassName('filter-buttons');
const deleteButtons = document.getElementsByClassName('delete');
const bookButtons = document.getElementsByClassName('book-room');

let usersData;
let roomsData;
let bookingsData;
let user;
let guest;
let manager;

const recievedUsersData = apiRequest.getUsersData();
const recievedRoomsData = apiRequest.getRoomsData();
const recievedBookingsData = apiRequest.getBookingsData();


fadeIn.addEventListener('animationend', displayLogin);
loginButton.addEventListener('click', displayDashboard);
searchGuestInput.addEventListener('keyup', displayManagerSearchResults);
dateSubmitButton.addEventListener('click', chooseDate)
for (let i = 0; i < filterButtons.length; i++) {
  filterButtons[i].addEventListener('click', filterRooms)
}

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


//not working
function updateBookingsData() {
  const updatedData = apiRequest.getBookingsData();
  Promise.all([updatedData])
    .then(value => {
      bookingsData = value[0];
    })
}


function createUser() {
  user = new User(usersData, bookingsData, roomsData);
}

function displayLogin() {
  bodyLogin.classList.remove('hidden');
  getTodaysDate()
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
  const guestBookings = bookingsData.filter(booking => {
    return booking.userID === guest.currentUser.id;
  })
  return guestBookings
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
  calendar.classList.remove('hidden');
  displaySearchUserBookings(guest.currentUser.name, 'guest', guestBookingsTitle);
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
  console.log(guestDetails);
  const displayGuestBookings = guestDetails.reduce((displayHTML, guest) => {
    displayHTML += `
      <article class="body__${htmlTag}__user__booking">
      <div>${guest.bookedDate}</div><div>Room: ${guest.roomNumber}</div><div>Type: ${guest.roomType} Per Night: $${guest.costPerNight}</div>
        <div class="delete ${guest.bookingID}" title="Delete Booking"></div>
       </article>
          `;
    return displayHTML;
  }, '')
  if (htmlTag === 'guest') {
    selector.insertAdjacentHTML('afterend', displayGuestBookings)
  } else {
    selector.innerHTML = displayGuestBookings;
  }
  addDeleteButtonEventListeners();
}

function formatUserBookings(name) {
  const userDetails = user.searchForGuest(name);
  return userDetails.bookings.reduce((formatDetails, booking) => {
    let format = {};
    format.bookingID = booking.id;
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
  document.querySelector('.main__guest__wrapper__article').innerHTML = `You have spent $${totalSpent}<br>Thank you for your patronage!`;
}

function chooseDate(e) {
  e.preventDefault();
  const formatDateValue = dateValue.value.split('-').join('/');
  const availableRooms = user.searchAvailability(formatDateValue);
  clearBookingsDetails()
  console.log(formatDateValue);
  console.log(availableRooms);
  displayGuestSearchResults(availableRooms, formatDateValue);
}
//invoke in manage dashboards
function getTodaysDate() {
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  return today = yyyy + '/' + mm + '/' + dd;
}

function displayGuestSearchResults(rooms, date) {
 const displaySearchResults = rooms.reduce((displayHTML, room) => {
    displayHTML += `
    <article class="body__guest__user__booking">
      <div>Type: ${room.roomType} </div><div>Per Night: $${room.costPerNight} </div><div>Bed(s): ${room.numBeds} ${room.bedSize}</div>
      <div class="book-room" id="${room.number}" title="Book The Room"></div>
    </article>
        `;
    return displayHTML;
  }, '')
  guestBookingsTitle.insertAdjacentHTML('afterend', displaySearchResults)
  document.querySelector('.main__guest__wrapper__article').innerText = `Search Results:`
  document.querySelector('.body__guest__user__booking').innerText = `Available rooms on ${date}`;
  addBookButtonEventListeners();
}

function filterRooms(e) {
  const formatDate = dateValue.value.split('-').join('/');
  const roomType = e.target.value;
  const filteredRooms = guest.filterRoomByType(roomType, formatDate)
  clearBookingsDetails();
  displayGuestSearchResults(filteredRooms, formatDate)
}

function clearBookingsDetails() {
  document.querySelectorAll('.body__guest__user__booking').forEach(query => {
    query.innerHTML = '';
    query.classList.remove('body__guest__user__booking');
  })
}

function addBooking(e) {
  const roomNumber = Number(e.target.id);
  const formatDate = dateValue.value.split('-').join('/');
  const bookingDetails = {
    "userID": guest.currentUser.id,
    "date": formatDate,
    roomNumber
  }
  apiRequest.postBookingData(bookingDetails);
  guest.bookARoom(roomNumber, guest.currentUser, dateValue.value);
}

function deleteBooking(e) {
  const identifyBooking = e.target.classList;
  const bookingNumber = Number(identifyBooking[1]);
  const bookingToDelete = user.findBookingToDelete(bookingNumber);
  apiRequest.deleteBookingData(bookingToDelete);
  updateBookingsData()
}

function addBookButtonEventListeners() {
  for (let i = 0; i < bookButtons.length; i++) {
    bookButtons[i].addEventListener('click', addBooking)
  }
}

function addDeleteButtonEventListeners() {
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener('click', deleteBooking)
  }
}