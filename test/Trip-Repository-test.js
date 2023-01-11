import { expect } from "chai";
import TripRepository from "../src/Trip-Repository";
import trips from "../src/data/trips-data";
import destinations from "../src/data/destination-data";

describe("Trip Repository", () => {
  let tripRepository;
  let tripData;
  let traveler;
  let destinationData;
  beforeEach(() => {
    traveler = {
      id: 3,
      name: "Sibby Dawidowitsch",
      travelerType: "shopper",
    };
    tripData = trips;
    destinationData = destinations;
    tripRepository = new TripRepository(tripData, destinationData);
  });
  it("should be a function", () => {
    expect(TripRepository).to.be.a("function");
  });
  it("should be an instance of TripRepository", () => {
    expect(tripRepository).to.be.an.instanceOf(TripRepository);
  });
  it("should hold all trip data", () => {
    expect(tripRepository.tripData).to.deep.equal(tripData);
  });
  it("should hold all destination data", () => {
    expect(tripRepository.destinationData).to.deep.equal(destinationData);
  });
  it("should find all trips for a traveler by their ID", () => {
    const a = [
      {
        id: 3,
        userID: 3,
        destinationID: 22,
        travelers: 4,
        date: "2022/05/22",
        duration: 17,
        status: "approved",
        suggestedActivities: [],
      },
    ];
    expect(tripRepository.filterByTravelerID(3)).to.deep.equal(a);
  });
  it("should filter a traveler's trips by status", () => {
    const a = [
      {
        id: 3,
        userID: 3,
        destinationID: 22,
        travelers: 4,
        date: "2022/05/22",
        duration: 17,
        status: "approved",
        suggestedActivities: [],
      },
    ];
    const b = [
      {
        id: 71,
        userID: 38,
        destinationID: 28,
        travelers: 1,
        date: "2020/05/26",
        duration: 11,
        status: "pending",
        suggestedActivities: [],
      },
    ];
    expect(tripRepository.filterTripsByStatus("approved", 3)).to.deep.equal(a);
    expect(tripRepository.filterTripsByStatus("pending", 38)).to.deep.equal(b);
  });
  it("should be able to find upcoming trips for a user", () => {
    const a = [
      {
        id: 11,
        userID: 50,
        destinationID: 5,
        travelers: 4,
        date: "2022/10/14",
        duration: 4,
        status: "approved",
        suggestedActivities: [],
      },
      {
        id: 15,
        userID: 50,
        destinationID: 13,
        travelers: 3,
        date: "2022/07/04",
        duration: 6,
        status: "approved",
        suggestedActivities: [],
      },
    ];
    expect(tripRepository.findUpcomingTrips(50)).to.deep.equal(a);
  });
  it("should be able to find past trips for a traveler", () => {
    const a = [
      {
        id: 201,
        userID: 44,
        destinationID: 20,
        travelers: 3,
        date: "2021/08/08",
        duration: 7,
        status: "approved",
        suggestedActivities: [],
      },
    ];
    expect(tripRepository.findPastTrips(44)).to.deep.equal(a);
  });
  it("should find the destination by name", () => {
    expect(tripRepository.findDestinationByName("Lima, Peru")).to.deep.equal(
      destinationData[0]
    );
    expect(tripRepository.findDestinationByName("New York")).to.equal(
      "No such destination."
    );
  });
  it("should calculate the cost of all trips for this year", () => {
    expect(tripRepository.calculateCostPerYear(44)).to.equal(2124);
  });
  it("should find all destinations for a traveler by their id", () => {
    const a = [
      {
        id: 49,
        destination: "Castries, St Lucia",
        estimatedLodgingCostPerDay: 650,
        estimatedFlightCostPerPerson: 90,
        image:
          "https://images.unsplash.com/photo-1524478075552-c2763ea171b8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1502&q=80",
        alt: "aerial photography of rocky mountain under cloudy sky",
      },
      {
        id: 20,
        destination: "Miami, Florida",
        estimatedLodgingCostPerDay: 158,
        estimatedFlightCostPerPerson: 275,
        image:
          "https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1573&q=80",
        alt: "sand with palm trees and tall buildings in the background",
      },
    ];
    expect(tripRepository.findDestinationsForUser(44)).to.deep.equal(a);
  });
});
