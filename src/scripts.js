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
let allTripsForTraveler;
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
const dropdown = document.getElementById("destinations");
const totalCostButton = document.getElementById("total-cost");
const totalCostSection = document.getElementById("total-trip-cost");
const duration = document.getElementById("duration-input");
const numberOfTravelers = document.getElementById("travelers");
const postMessage = document.getElementById("trip-requested-message");
const dateInput = document.getElementById("date-input");
const requestTripButton = document.getElementById("request-trip");

loginButton.addEventListener("click", () => {
  logInTraveler();
  displayTotalSpent();
  displayTrips(allTripsForTraveler);
  createDropdown();
});
upcomingTripsButton.addEventListener("click", () => {
  tripsContainer.innerHTML = "";
  displayTrips(upcomingTripsData);
});
allTripsButton.addEventListener("click", () => {
  tripsContainer.innerHTML = "";
  displayTrips(allTripsForTraveler);
});
pastTripsButton.addEventListener("click", () => {
  tripsContainer.innerHTML = "";
  displayTrips(pastTripsData);
});
pendingTripsButton.addEventListener("click", () => {
  tripsContainer.innerHTML = "";
  displayTrips(pendingTripsData);
});
totalCostButton.addEventListener("click", displayCost);
requestTripButton.addEventListener("click", createPost);

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
    loginErrorMessage.innerText =
      "Sorry, failed to load. Please try again later.";
  });

function createClassInstances(data1, data2, data3) {
  travelerRepository = new TravelerRepository(data1);
  tripRepository = new TripRepository(data2, data3);
}

function logInTraveler() {
  const traveler = username.value.substr(0, 8);
  const id = username.value.substr(8, 1);
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
    allTripsForTraveler = tripRepository.filterByTravelerID(currentTravelerId);
    pastTripsData = tripRepository.findPastTrips(currentTravelerId);
    upcomingTripsData = tripRepository.findUpcomingTrips(currentTravelerId);
    pendingTripsData = tripRepository.filterTripsByStatus(
      "pending",
      currentTravelerId
    );
    loginSection.classList.add("hidden");
    travelerPage.classList.remove("hidden");
  } else if (
    traveler !== "traveler" ||
    id.length < 1 ||
    password.value !== "travel"
  ) {
    loginErrorMessage.classList.remove("hidden");
    loginErrorMessage.setAttribute("aria-invalid", true);
  }
}

function displayTotalSpent() {
  totalSection.innerText = `Total Spent on Trips This Year: $${tripRepository.calculateCostPerYear(
    currentTravelerId
  )}`;
}

function displayTrips(tripsData) {
  tripsData.forEach((trip) => {
    const destination = tripRepository.findDestinationById(trip.destinationID);
    console.log(destination);
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
}

function createDropdown() {
  const allDestinationsSorted = allDestinations.sort((a, b) => {
    return a.destination.localeCompare(b.destination);
  });
  allDestinationsSorted.forEach((destination) => {
    dropdown.innerHTML += `
    <option value="${destination.destination}">${destination.destination}</option>
    `;
  });
}

function displayCost() {
  const destination = tripRepository.findDestinationByName(dropdown.value);
  const total =
    destination.estimatedLodgingCostPerDay * duration.value +
    destination.estimatedFlightCostPerPerson * numberOfTravelers.value;
  totalCostSection.classList.remove("hidden");
  totalCostSection.innerText = `$${total} for this new trip`;
}

function createPost() {
  if (preverDuplicates(allTrips, currentTravelerId, dateInput.value)) {
    postMessage.classList.remove("hidden");
    postMessage.innerText = "Please select another date to depart from.";
    return;
  } else {
    if (dropdown.value && duration.value && numberOfTravelers.value) {
      const destinationId = allDestinations.find(
        (destination) => destination.destination === dropdown.value
      );
      const tripObject = {
        id: allTrips.length + 1,
        userID: currentTravelerId,
        destinationID: Number(destinationId.id),
        travelers: numberOfTravelers.value,
        date: dateInput.value.replaceAll("-", "/"),
        duration: Number(duration.value),
        status: "pending",
        suggestedActivities: [],
      };
      postTrip(tripObject);
      tripsContainer.innerHTML = "";
      displayTrips(allTripsForTraveler);
    }
  }
}

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
      postMessage.classList.remove("hidden");
      postMessage.innerText =
        "Success! Your trip has been requested and is pending. You'll hear back from an agent shortly!";
      return getData("http://localhost:3001/api/v1/trips")
        .then((data) => {
          tripRepository = new TripRepository(data.trips, allDestinations);
          allTripsForTraveler =
            tripRepository.filterByTravelerID(currentTravelerId);
          pastTripsData = tripRepository.findPastTrips(currentTravelerId);
          upcomingTripsData =
            tripRepository.findUpcomingTrips(currentTravelerId);
          pendingTripsData = tripRepository.filterTripsByStatus(
            "pending",
            currentTravelerId
          );
        })
        .catch((err) => {
          errorMessage.classList.remove("hidden");
          errorMessage.innerText =
            "This is embarrasing. We've run into an error. Please try again later.";
        });
    })
    .catch((err) => {
      postMessage.classList.remove("hidden");
      postMessage.innerText =
        "This is embarrasing. We've run into an error. Please try again later.";
    });
}

function preverDuplicates(data, userID, date) {
  data.find((trip) => {
    return trip.date === date && trip.userID === userID;
  });
}
