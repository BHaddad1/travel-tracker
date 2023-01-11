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
    expect(tripRepository.findTripsByDate(50)).to.deep.equal(a);
  });
});
