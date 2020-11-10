import './css/base.scss';
import './css/base.scss';
import User from './User';
import Guest from './Guest';
import Manager from './Manager';
import apiRequest from './api-request';
import domUpdate from './dom-update';
import svgAnimation from './svg';
import Chart from 'chart.js';

const modal = document.getElementById('id01');
const bodyLogin = document.querySelector('.body__login');
const fadeIn = document.querySelector('.fade-in');
const loginUsername = document.querySelector('#login-username');
const loginPassword = document.querySelector('#login-password');
const loginButton = document.querySelector('.login-button');
const managerDashboard = document.querySelector('.body__manager ');
const main = document.querySelector('main');
const guestBookingview = document.querySelectorAll('.body__guest__user__view')[1];
const searchGuestInput = document.querySelector('#search-guest');
const managerGuestBookings = document.querySelector('.body__manager__user__section');
const guestBookingsTitle = document.querySelector('#bookings-title');
const dateSubmitButton = document.querySelector('.date-submit');
const dateValue = document.querySelector('#date-search');
//const calendar = document.querySelector('.calendar');
//const filterButtons = document.getElementsByClassName('filter-buttons');
//const deleteButtons = document.getElementsByClassName('delete');
//const bookButtons = document.getElementsByClassName('book-room');
const openModalButton = document.querySelector('.open-modal-button');

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
openModalButton.addEventListener('click', showLoginPrompts);
dateSubmitButton.addEventListener('click', chooseDate);
window.onclick = closeModal;
window.onload = loadEvents;

Promise.all([recievedUsersData, recievedRoomsData, recievedBookingsData])
  .then(value => {
    usersData = value[0];
    roomsData = value[1];
    bookingsData = value[2];
    createUser();
  })

function loadEvents() {
  loadBackground();
  addFilterButtonEventListener();
}

function loadBackground() {
  document.querySelector('head').insertAdjacentHTML('afterend', svgAnimation)
}

function closeModal(e) {
  if (e.target === modal) {
    modal.style.display = "none";
  }
}

function addFilterButtonEventListener() {
  const filterButtons = document.getElementsByClassName('filter-buttons');
  for (let i = 0; i < filterButtons.length; i++) {
    filterButtons[i].addEventListener('click', filterRooms)
  }
}

function addBookButtonEventListeners() {
  const bookButtons = document.getElementsByClassName('book-room');
  for (let i = 0; i < bookButtons.length; i++) {
    bookButtons[i].addEventListener('click', addBooking);
  }
}

function addDeleteButtonEventListeners() {
  const deleteButtons = document.getElementsByClassName('delete');
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener('click', deleteBooking);
  }
}

function createUser() {
  user = new User(usersData, bookingsData, roomsData);
}

function displayLogin() {
  bodyLogin.classList.add('flex')
  bodyLogin.classList.remove('hidden');
  getTodaysDate()
}

function showLoginPrompts() {
  modal.style.display = 'block';
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
  const today = getTodaysDate();
  if (!checkPassword() || !checkUsername()) {
    alert('You username and password did not match our system. Please re-enter');
    return
  }
  if (loginUsername.value === 'manager') {
    createManager();
    displayManagerDashboard(today);
  } else if (loginUsername.value.includes('customer')) {
    createGuest();
    displayGuestDashboard();
  }
}

function createGuest() {
  usersData.forEach(user => {
    if (loginUsername.value === `customer${user.id}` || searchGuestInput.value === user.name) {
      guest = new Guest(usersData, bookingsData, roomsData, user);
      guest.bookings = createGuestBookings(guest)
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
  if (loginUsername.value === `manager` && loginPassword.value === 'overlook2020') {
    manager = new Manager(usersData, bookingsData, roomsData);
  }
}

function createChart() {
  const today = getTodaysDate()
  const availableRooms = manager.searchAvailability(today);
  new Chart(document.getElementById("doughnut-chart"), {
    type: 'doughnut',
    data: {
      labels: ["Rooms Booked", "Rooms Available"],
      datasets: [
        {
          label: "Percent Rooms Booked",
          backgroundColor: ["#8e5ea2", "#3e95cd"],
          data: [(25 - availableRooms.length), availableRooms.length]
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Hotel Capacity'
      }
    }
  });
}

function displayManagerDashboard(date) {
  handleManagerClassDisplay();
  displayManagerAvailableRooms(date);
  displayTodaysRevenue(date);
  createChart()
}

function displayGuestDashboard() {
  handleGuestClassDisplay();
  displaySearchUserBookings(guest.currentUser.name, 'guest', guestBookingsTitle);
  displayGuestTotalSpent(guest);
}

function handleManagerClassDisplay() {
  managerDashboard.classList.remove('hidden');
  bodyLogin.classList.add('hidden');
}

function handleGuestClassDisplay() {
  main.classList.remove('hidden');
  guestBookingview.classList.remove('hidden');
  bodyLogin.classList.add('hidden');
  document.querySelector('.calendar').classList.remove('hidden');
}

function displayManagerAvailableRooms(date) {
  const availableRooms = manager.searchAvailability(date);
  document.querySelector('.body__manager__available__rooms').innerText = `${availableRooms.length}`;
}

function displayTodaysRevenue(date) {
  const totalRevenue = manager.getTodaysRevenue(date).toFixed(2);
  document.querySelector('.body__manager__total__revenue').innerText = `$${totalRevenue}`;
}

function displayManagerSearchResults(e) {
  if (e.key === 'Enter') {
    domUpdate.displaySearchUserDetails(manager, searchGuestInput.value);
    displaySearchUserBookings(searchGuestInput.value, 'manager', managerGuestBookings);
    document.querySelector('.manager-date-submit').addEventListener('click', showRoomsByDate);
    createGuest();
  }
}

function displaySearchUserBookings(name, htmlTag, selector) {
  const guestDetails = formatUserBookings(name);
  const guestBookings = domUpdate.displayGuestBookings(guestDetails, htmlTag);
  if (htmlTag === 'guest') {
    selector.insertAdjacentHTML('afterend', guestBookings);
  } else {
    selector.innerHTML = guestBookings;
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
        format.bidet = room.bidet;
      }
    })
    formatDetails.push(format);
    return formatDetails.sort((a, b) => a.bookedDate > b.bookedDate ? -1 : 1);
  }, [])
}

function displayGuestTotalSpent() {
  const totalSpent = guest.calculateTotalSpent(guest.bookings);
  const firstName = guest.currentUser.name.split(' ')
  document.querySelector('.main__guest__wrapper__article').innerHTML = `${firstName[0]}, you have spent $${totalSpent}.<br> We greatly appreciate your business!`;
}

function chooseDate(e) {
  e.preventDefault();
  const formatDate = formatDateValue(dateValue.value);
  const availableRooms = user.searchAvailability(formatDate);
  if (compareDates(formatDate)) {
    if (!availableRooms.length) {
      alert(`We are sorry to inform you that all rooms are booked on ${formatDate}. \n Please choose another date`)
    } else {
      domUpdate.clearBookingsDetails();
      displayGuestSearchResults(availableRooms, formatDate);
    }
  } else {
    alert('Please pick a date in the future');
  }
}

function getTodaysDate() {
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  return today = yyyy + '/' + mm + '/' + dd;
}

function displayGuestSearchResults(rooms, date) {
  const searchResults = domUpdate.displaySearchResults(rooms);
  guestBookingsTitle.insertAdjacentHTML('afterend', searchResults);
  document.querySelector('.main__guest__wrapper__article').innerText = `Search Results:`;
  document.querySelector('.body__guest__user__booking').innerText = `Available rooms on ${date}`;
  addBookButtonEventListeners();
}

function filterRooms(e) {
  if (dateValue.value === '') {
    alert('Please choose a date before filtering')
  } else {
    const formatDate = formatDateValue(dateValue.value);
    const roomType = e.target.value;
    const filteredRooms = guest.filterRoomByType(roomType, formatDate);
    domUpdate.clearBookingsDetails();
    displayGuestSearchResults(filteredRooms, formatDate);
  }
}

function addBooking(e) {
  const managerSearchDate = document.querySelector('#manager-date-search')
  const roomNumber = Number(e.target.id);
  let formatDate;
  if (dateValue.value !== '') {
    formatDate = formatDateValue(dateValue.value);
  } else {
    formatDate = formatDateValue(managerSearchDate.value);
  }
  if (!compareDates(formatDate)) {
    alert('You cannot book a room for a date that has already occured.')
  } else {
    const bookingDetails = {
      "userID": guest.currentUser.id,
      "date": formatDate,
      roomNumber
    }
    let onSuccess = () => {
      getUpdatedBookings();
    }
    apiRequest.postBookingData(bookingDetails, onSuccess);
    alert('This room has been booked!');
  }
}

function getUpdatedBookings() {
  recievedBookingsData = apiRequest.getBookingsData();
  recievedBookingsData
    .then(value => {
      bookingsData = value;
      user.bookings = value;
      guest.bookings = createGuestBookings(guest);
      displayRefetch();
    })
}

function displayRefetch() {
  if (!dateValue.value) {
    displaySearchUserBookings(searchGuestInput.value, 'manager', managerGuestBookings);
  } else {
    displaySearchUserBookings(guest.currentUser.name, 'guest', guestBookingsTitle);
    displayGuestTotalSpent(guest);
  }
}

function deleteBooking(e) {
  const identifyBooking = e.target.classList;
  const bookingNumber = Number(identifyBooking[1]);
  const bookingToDelete = user.findBookingToDelete(bookingNumber);
  if (!compareDates(bookingToDelete.date)) {
    alert('Cannot cancel a past reservation!')
  } else {
    let onSuccess = () => {
      getUpdatedBookings();
    }
    apiRequest.deleteBookingData(bookingToDelete, onSuccess);
    alert('Your booking has been deleted!');
  }
}

function showRoomsByDate(e) {
  e.preventDefault();
  const managerSearchDate = document.querySelector('#manager-date-search');
  const formatDate = formatDateValue(managerSearchDate.value);
  if (compareDates(formatDate)) {
    const availableRoomsOnDate = manager.searchAvailability(formatDate);
    const searchHTML = domUpdate.displaySearchResults(availableRoomsOnDate);
    document.querySelector('.manager-calendar').insertAdjacentHTML('afterend', searchHTML);
    addBookButtonEventListeners();
  } else {
    alert('Please pick a date in the future');
  }
}

function formatDateValue(date) {
  return date.split('-').join('/');
}

function compareDates(bookingDate) {
  const todaysDate = getTodaysDate().split('/').join('-');
  const booking = bookingDate.split('/').join('-');
  return new Date(booking) > new Date(todaysDate);
}