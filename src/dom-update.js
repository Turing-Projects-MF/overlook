const domUpdate = {
  clearBookingsDetails() {
    document.querySelectorAll('.body__guest__user__booking').forEach(query => {
      query.innerHTML = '';
      query.classList.remove('body__guest__user__booking');
    })
  },

  displaySearchResults(rooms) {
    return rooms.reduce((displayHTML, room) => {
      displayHTML += `
      <article class="body__guest__user__booking">
        <div>Type: ${room.roomType} </div><div>Per Night: $${room.costPerNight} </div><div>Bed(s): ${room.numBeds} ${room.bedSize}</div>
        <div class="book-room" id="${room.number}" title="Book The Room"></div>
      </article>
        `;
      return displayHTML;
    }, '')
  },

  displayGuestBookings(guest, htmlTag) {
    return guest.reduce((displayHTML, guest) => {
      displayHTML += `
        <article class="body__${htmlTag}__user__booking">
        <div>${guest.bookedDate}</div><div>Room: ${guest.roomNumber}</div><div>Type: ${guest.roomType} Per Night: $${guest.costPerNight}</div>
          <div class="delete ${guest.bookingID}" title="Delete Booking"></div>
         </article>
            `;
      return displayHTML;
    }, '')
  },

  displaySearchUserDetails(user, searchValue) {
    const guest = user.searchForGuest(searchValue);
    const guestDetails = `
    <article class="body__manager__user__wrapper__article" id="manager-guest-name">${guest.guest}</article>
    <article class="body__manager__user__wrapper__article" id="manager-guest-spent">$${guest.spent}</article>
    <form class="manager-calendar">
        <label for="manager-date-search">Search Availability:</label>
        <input type="date" id="manager-date-search" name="manager-date-search">
        <input class="manager-date-submit" type="submit">
      </form>
    `;
    document.querySelector('.body__manager__user__wrapper').innerHTML = guestDetails;

  }
};

export default domUpdate;