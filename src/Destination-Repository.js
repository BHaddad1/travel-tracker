class DestinationRepository {
  constructor(allDestinationData) {
    this.allDestinationData = allDestinationData;
  }
  findDestinationByName(name) {
    const foundDestination = this.allDestinationData.find(
      (destination) => destination.destination === name
    );
    if (!foundDestination) {
      return "No such destination.";
    }
    return foundDestination;
  }
};

export default DestinationRepository;
