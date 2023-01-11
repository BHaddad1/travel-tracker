import { expect } from "chai";
import TripRepository from "../src/Trip-Repository";
import trips from "../src/data/trips-data";

describe("Trip Repository", () => {
  let tripRepository;
  let tripData;
  let traveler;
  beforeEach(() => {
    traveler = {
      id: 3,
      name: "Sibby Dawidowitsch",
      travelerType: "shopper",
    };
    tripData = trips;
    tripRepository = new TripRepository(tripData);
  });
  it("should be a function", () => {
    expect(TripRepository).to.be.a("function");
  });
  it("should be an instance of TripRepository", () => {
    expect(tripRepository).to.be.an.instanceOf(TripRepository);
  });
  it("should hold all trip data", () => {
    expect(tripRepository.allTripData).to.deep.equal(tripData);
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
});
