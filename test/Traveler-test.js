import { expect } from "chai";
import Traveler from "../src/Traveler";

describe("Traveler", () => {
  let traveler;
  beforeEach(() => {
    traveler = new Traveler({
      id: 1,
      name: "Ham Leadbeater",
      travelerType: "relaxer",
    });
  });
  it("should be a function", () => {
    expect(Traveler).to.be.a("function");
  });
  it("should be an instance of Traveler", () => {
    expect(traveler).to.be.an.instanceOf(Traveler);
  });
  it("should hold the id of the traveler", () => {
    expect(traveler.id).to.equal(1);
  });
  it("should hold the name of the traveler", () => {
    expect(traveler.name).to.equal("Ham Leadbeater");
  });
  it("should hold the traveler type", () => {
    expect(traveler.travelerType).to.equal("relaxer");
  })
});
