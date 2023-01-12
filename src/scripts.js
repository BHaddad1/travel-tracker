import "./css/styles.css";
import * as dayjs from "dayjs";
import TravelerRepository from "../src/Traveler-Repository";
import Traveler from "../src/Traveler";
import TripRepository from "../src/Trip-Repository";
import Trip from "../src/Trip";
import "./images/turing-logo.png";
import "./images/catTravel2.jpg";

let allTrips;
let allTravelers;
let allDestinations;
let travelerRepository;
let tripRepository;
let currentTraveler;
let currentTravelerId;
let allTripsData;
let pastTripsData;
let upcomingTripsData;
let pendingTripsData;

const totalSection = document.getElementById("total");
const tripsContainer = document.getElementById("trips-container");
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

loginButton.addEventListener("click", () => {
  logInTraveler();
  displayTotalSpent();
  displayTrips(allTripsData);
});
upcomingTripsButton.addEventListener("click", () => {
  tripsContainer.innerHTML = "";
  displayTrips(upcomingTripsData);
});
allTripsButton.addEventListener("click", () => {
  tripsContainer.innerHTML = "";
  displayTrips(allTripsData);
});
pastTripsButton.addEventListener("click", () => {
  tripsContainer.innerHTML = "";
  displayTrips(pastTripsData);
});
pendingTripsButton.addEventListener("click", () => {
  tripsContainer.innerHTML = "";
  displayTrips(pendingTripsData);
})

const getData = (url) => {
  return fetch(url)
    .then((res) => {
      if (res.status >= 400) {
        throw new Error();
      }
      return res.json();
    })
    .catch((err) => console.log(err));
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
    errorMessage.classList.remove("hidden");
    errorMessage.innerText = "Sorry, failed to load. Please try again later.";
  });

function createClassInstances(data1, data2, data3) {
  travelerRepository = new TravelerRepository(data1);
  tripRepository = new TripRepository(data2, data3);
};

function logInTraveler() {
  const traveler = username.value.substr(0, 8);
  if (
    traveler === "traveler" &&
    username.value.length > 8 &&
    username.value.length < 11 &&
    password.value === "travel"
  ) {
    const allCharacters = username.value.split("");
    const id = allCharacters.filter((char) => {
      return Number(char);
    });
    if (allCharacters[9] === 0) {
      id.push("0");
    }
    const joinedId = id.join("");
    const number = Number(joinedId);
    currentTraveler = travelerRepository.findTravelerById(number);
    currentTravelerId = currentTraveler.id;
    allTripsData = tripRepository.filterByTravelerID(currentTravelerId);
    pastTripsData = tripRepository.findPastTrips(currentTravelerId);
    upcomingTripsData = tripRepository.findUpcomingTrips(currentTravelerId);
    pendingTripsData = tripRepository.filterTripsByStatus("pending", currentTravelerId);
    loginSection.classList.add("hidden");
    travelerPage.classList.remove("hidden");
  } else if (traveler !== "traveler" || password.value !== "travel") {
    loginErrorMessage.classList.remove("hidden");
  }
};

function displayTotalSpent() {
  totalSection.innerText = `Total Spent on Trips This Year: $${tripRepository.calculateCostPerYear(currentTravelerId)}`;
};

function displayTrips(tripsData) {
  tripsData.forEach((trip) => {
    const destination = tripRepository.findDestinationById(trip.destinationID);
    tripsContainer.innerHTML += `
      <section class="trip-card-template">
        <img class="card-image" alt="${destination.alt}" src="${destination.image}" />
        <p class="trip trip-name">Going To: ${destination.destination}</p>
        <p class="trip date">Leaving On: ${trip.date}</p>
        <p class="trip number-of-travelers">${trip.travelers} Travelers</p>
        <p class="trip duration">${trip.duration} Days</p>
        <p class="trip status">Status: ${trip.status}</p>
      </section>
    `;
  });
};

function createPostObject() {
  
}
