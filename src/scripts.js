import "./css/styles.css";
import * as dayjs from "dayjs";
import TravelerRepository from "../src/Traveler-Repository";
import TripRepository from "../src/Trip-Repository";
import "./images/catTravel2.jpg";

let allTrips;
let allTravelers;
let allDestinations;
let travelerRepository;
let tripRepository;
let currentTraveler;
let currentTravelerId;
let allTripsForTraveler;
let pastTripsData;
let upcomingTripsData;
let pendingTripsData;
let totalForNewTrip = 0;

const totalSection = document.getElementById("total");
const tripsContainer = document.getElementById("trips-container");
const loginForm = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");
const username = document.getElementById("username");
const password = document.getElementById("password");
const loginButton = document.getElementById("login-button");
const loginSection = document.getElementById("login-section");
const travelerPage = document.getElementById("traveler-page");
const loginErrorMessage = document.getElementById("login-error");
const upcomingTripsButton = document.getElementById("upcoming-trips");
const allTripsButton = document.getElementById("all-trips");
const pastTripsButton = document.getElementById("past-trips");
const pendingTripsButton = document.getElementById("pending-trips");
const dropdown = document.getElementById("destinations");
const tripCostButton = document.getElementById("total-cost");
const totalCostSection = document.getElementById("total-trip-cost");
const duration = document.getElementById("duration-input");
const numberOfTravelers = document.getElementById("travelers");
const postMessage = document.getElementById("trip-requested-message");
const dateInput = document.getElementById("date-input");
const requestTripButton = document.getElementById("request-trip");
const logoutButton = document.getElementById("logout-button");
const nameSection = document.getElementById("name");

loginButton.addEventListener("click", () => {
  logInTraveler();
  displayTotalSpent();
  displayTrips(allTripsForTraveler);
  createDropdown();
  tripCostButton.disabled = true;
  requestTripButton.disabled = true;
  nameSection.innerText = `Welcome, ${currentTraveler.name}!`
});
upcomingTripsButton.addEventListener("click", () => {
  displayTrips(upcomingTripsData);
});
allTripsButton.addEventListener("click", () => {
  displayTrips(allTripsForTraveler);
});
pastTripsButton.addEventListener("click", () => {
  displayTrips(pastTripsData);
});
pendingTripsButton.addEventListener("click", () => {
  displayTrips(pendingTripsData);
});
duration.addEventListener("keyup", () => {
  tripCostButton.disabled = false;
  requestTripButton.disabled = false;
})
tripCostButton.addEventListener("click",() => {
  displayTripCost();
  tripCostButton.disabled = true;
});
requestTripButton.addEventListener("click", () => {
  createPost();
  requestTripButton.disabled = true;
});
logoutButton.addEventListener("click", logoutTraveler);

const getData = (url) => {
  return fetch(url).then((res) => {
    if (res.status >= 400) {
      throw new Error();
    }
    return res.json();
  });
};

Promise.all([
  getData("http://localhost:3001/api/v1/travelers"),
  getData("http://localhost:3001/api/v1/trips"),
  getData("http://localhost:3001/api/v1/destinations"),
])
  .then((data) => {
    allTravelers = data[0].travelers;
    allTrips = data[1].trips;
    allDestinations = data[2].destinations;
    createClassInstances(allTravelers, allTrips, allDestinations);
  })
  .catch((err) => {
    loginErrorMessage.classList.remove("hidden");
    loginErrorMessage.innerText = "Sorry, failed to load. Please try again later.";
    loginButton.disabled = true;
  });

function createClassInstances(data1, data2, data3) {
  travelerRepository = new TravelerRepository(data1);
  tripRepository = new TripRepository(data2, data3);
};

function logInTraveler() {
  const traveler = username.value.substr(0, 8);
  const longerId = username.value.substr(8, 2);
  const evenLongerId = username.value.substr(8, 3);
  if (traveler === "traveler" && Number(longerId) < 51 && Number(evenLongerId) < 51 && password.value === "travel") {
    currentTraveler = travelerRepository.findTravelerById(Number(longerId));
    currentTravelerId = currentTraveler.id;
    allTripsForTraveler = tripRepository.filterByTravelerID(currentTravelerId);
    pastTripsData = tripRepository.findPastTrips(currentTravelerId);
    upcomingTripsData = tripRepository.findUpcomingTrips(currentTravelerId);
    pendingTripsData = tripRepository.filterTripsByStatus("pending", currentTravelerId);
    loginSection.classList.add("hidden");
    travelerPage.classList.remove("hidden");
    postMessage.classList.remove("hidden");
    postMessage.innerText = "Please fill out ALL inputs before requesting a trip."
    loginErrorMessage.classList.add("hidden");
    loginForm.reset();
  } else if (traveler !== "traveler" || password.value !== "travel") {
    loginErrorMessage.classList.remove("hidden");
    loginErrorMessage.setAttribute("aria-invalid", true);
    loginErrorMessage.innerText = "Invalid username and password combination.";
    loginForm.reset();
  } else if (Number(longerId) >= 51 && Number(evenLongerId) >= 51) {
    loginErrorMessage.classList.remove("hidden");
    loginErrorMessage.setAttribute("aria-invalid", true);
    loginErrorMessage.innerText = "Invalid username. Please try again with a valid ID.";
    loginForm.reset();
  };
};

function displayTotalSpent() {
  const total = tripRepository.calculateCostPerYear(currentTravelerId);
  const newTotal = total + totalForNewTrip;
  const formattedTotal = newTotal.toLocaleString("en-US");
  totalSection.innerText = `Total Spent on Trips This Year: $${formattedTotal}`;
};

function displayTrips(tripsData) {
  tripsContainer.innerHTML = "";
  tripsData.forEach((trip) => {
    const destination = tripRepository.findDestinationById(trip.destinationID);
    tripsContainer.innerHTML += `
      <section class="trip-card-template">
        <img class="card-image" alt="${destination.alt}" src="${destination.image}" />
        <section class="trip-details-container">
          <p class="trip trip-name">Going To: ${destination.destination}</p>
          <p class="trip date">Leaving On: ${trip.date}</p>
          <p class="trip number-of-travelers">${trip.travelers} Travelers</p>
          <p class="trip duration">${trip.duration} Days</p>
          <p class="trip status">Status: ${trip.status}</p>
        </section>
      </section>
    `;
  });
};

function createDropdown() {
  allDestinations
  .sort((a, b) => {
    return a.destination.localeCompare(b.destination);
  })
  .forEach((destination) => {
    dropdown.innerHTML += `
    <option value="${destination.destination}">${destination.destination}</option>
    `;
  });
};

function displayTripCost() {
  const destination = tripRepository.findDestinationByName(dropdown.value);
  const total =
    destination.estimatedLodgingCostPerDay * duration.value +
    destination.estimatedFlightCostPerPerson * numberOfTravelers.value;
  const formattedTotal = total.toLocaleString("en-US");
  postMessage.classList.add("hidden");
  totalCostSection.classList.remove("hidden");
  totalCostSection.innerText = `$${formattedTotal} for this new trip`;
  totalForNewTrip += total;
};

function createPost() {
  if (preventDuplicates(allTrips, currentTravelerId, dayjs(dateInput.value).format("YYYY/MM/DD"))) {
    postMessage.classList.remove("hidden");
    postMessage.innerText = "Please select another date to depart from.";
    return;
  } else {
    if (dropdown.value && duration.value && numberOfTravelers.value) {
      const destinationId = allDestinations.find(destination => destination.destination === dropdown.value);
      const tripObject = {
        id: allTrips.length + 1,
        userID: currentTravelerId,
        destinationID: Number(destinationId.id),
        travelers: numberOfTravelers.value,
        date: dayjs(dateInput.value).format("YYYY/MM/DD"),
        duration: Number(duration.value),
        status: "pending",
        suggestedActivities: [],
      };
      postTrip(tripObject);
      displayTotalSpent();
    };
  };
};

function postTrip(data) {
  return fetch("http://localhost:3001/api/v1/trips", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok || res.status >= 400) {
        throw new Error();
      }
      return res.json();
    })
    .then((data) => {
      totalCostSection.classList.add("hidden");
      postMessage.classList.remove("hidden");
      postMessage.innerText =
        "Success! Your trip has been requested and is pending. You'll hear back from an agent shortly!";
      dropdown.value = "";
      duration.value = "";
      numberOfTravelers.value = "";
      dateInput.value = "";
      setTimeout(() => {
        postMessage.innerText = "Please fill out ALL inputs before requesting a trip."
      }, 3000);
      return getData("http://localhost:3001/api/v1/trips")
        .then((data) => {
          tripRepository = new TripRepository(data.trips, allDestinations);
          allTripsForTraveler = tripRepository.filterByTravelerID(currentTravelerId);
          pastTripsData = tripRepository.findPastTrips(currentTravelerId);
          upcomingTripsData = tripRepository.findUpcomingTrips(currentTravelerId);
          pendingTripsData = tripRepository.filterTripsByStatus("pending", currentTravelerId);
          tripsContainer.innerHTML = "";
          displayTrips(allTripsForTraveler);
        })
        .catch((err) => {
          errorMessage.classList.remove("hidden");
          errorMessage.innerText = "This is embarrasing. We've run into an error. Please try again later.";
        });
    })
    .catch((err) => {
      postMessage.classList.remove("hidden");
      postMessage.innerText = "This is embarrasing. We've run into an error. Please try again later.";
    });
};

function preventDuplicates(data, userID, date) {
 return data.find((trip) => {
    return trip.date === date && trip.userID === userID;
  });
};

function logoutTraveler() {
  loginSection.classList.remove("hidden");
  travelerPage.classList.add("hidden");
};