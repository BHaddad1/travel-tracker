import { expect } from "chai";
import TripRepository from "../src/Trip-Repository";
import trips from "../src/data/trips-data";
import destinations from "../src/data/destination-data"

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
    expect(tripRepository.findDestinationByName("Lima, Peru")).to.deep.equal(destinationData[0]);
    expect(tripRepository.findDestinationByName("New York")).to.equal("No such destination.")
  });
  it.skip("should calculate the cost of a single trip", () => {
    const traveler44 =  {
      id: 1,
      userID: 44,
      destinationID: 49,
      travelers: 1,
      date: "2022/09/16",
      duration: 8,
      status: "approved",
      suggestedActivities: [],
    };
    expect(tripRepository.calculateCostOfTrip(44)).to.equal(null);
  });
  it("should calculate the cost of all trips for this year", () => {
    expect(tripRepository.calculateCostPerYear(44)).to.equal(2124);
  });
});
