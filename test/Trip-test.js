import { expect } from "chai";
import Trip from "../src/Trip";

describe("Trip", () => {
  let trip;
  beforeEach(() => {
    trip = new Trip({
      id: 1,
      userID: 44,
      destinationID: 49,
      travelers: 1,
      date: "2022/09/16",
      duration: 8,
      status: "approved",
      suggestedActivities: [],
    });
  });
  it("should be a function", () => {
    expect(Trip).to.be.a("function");
  });
  it("should be an instance of Trip", () => {
    expect(trip).to.be.an.instanceOf(Trip);
  });
  it("should hold a trip id", () => {
    expect(trip.id).to.equal(1);
  });
  it("should hold the user id", () => {
    expect(trip.userID).to.equal(44);
  });
  it("should hold the destination id", () => {
    expect(trip.destinationID).to.equal(49);
  });
  it("should hold the number of travelers", () => {
    expect(trip.travelers).to.equal(1);
  });
  it("should hold the trip start date", () => {
    expect(trip.date).to.equal("2022/09/16");
  });
  it("should hold the duration of the trip", () => {
    expect(trip.duration).to.equal(8);
  });
  it("should hold the status of the trip", () => {
    expect(trip.status).to.equal("approved");
  });
  it("should hold the suggested activities for that trip", () => {
    expect(trip.suggestedActivities).to.deep.equal([]);
  });
});
