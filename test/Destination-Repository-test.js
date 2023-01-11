import { expect } from "chai";
import DestinationRepository from "../src/Destination-Repository";
import destinations from "../src/data/destination-data";

describe("Destination Repository", () => {
  let allDestinationData;
  let destinationRepository;
  beforeEach(() => {
    allDestinationData = destinations;
    destinationRepository = new DestinationRepository(allDestinationData);
  });
  it("should be a function", () => {
    expect(DestinationRepository).to.be.a("function");
  });
  it("should be an instance of DestinationRepository", () => {
    expect(destinationRepository).to.be.an.instanceOf(DestinationRepository);
  });
  it("should hold all destination data", () => {
    expect(destinationRepository.allDestinationData).to.deep.equal(allDestinationData);
  });
  it("should find the destination by name", () => {
    expect(destinationRepository.findDestinationByName("Lima, Peru")).to.deep.equal(allDestinationData[0]);
    expect(destinationRepository.findDestinationByName("New York")).to.equal("No such destination.")
  });
});