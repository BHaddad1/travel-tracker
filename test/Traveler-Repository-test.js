import { expect } from "chai";
import TravelerRepository from "../src/Traveler-Repository";
import travelers from "../src/data/travelers-data";

describe("Traveler Repository", () => {
  let travelerRepository;
  let travelerData;
  beforeEach(() => {
    travelerData = travelers;
    travelerRepository = new TravelerRepository(travelerData);
  });
  it("should be a function", () => {
    expect(TravelerRepository).to.be.a("function");
  });
  it("should be an instance of TravelerRepository", () => {
    expect(travelerRepository).to.be.an.instanceOf(TravelerRepository);
  });
  it("should hold all traveler data", () => {
    expect(travelerRepository.allTravelerData).to.deep.equal(travelers);
  });
  it("should find the traveler by id", () => {
    const a = {
      id: 1,
      name: "Ham Leadbeater",
      travelerType: "relaxer",
    };
    expect(travelerRepository.findTravelerById(1)).to.deep.equal(a);
  });
  it("should return a message if there is no such traveler found", () => {
    expect(travelerRepository.findTravelerById(51)).to.equal("No such user found.");
  });
});
