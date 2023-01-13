class TravelerRepository {
  constructor(allTravelerData) {
    this.allTravelerData = allTravelerData;
  }
  findTravelerById(id) {
    const traveler = this.allTravelerData.find(traveler => traveler.id === id);
    if (!traveler) {
      return "No such user found."
    }
      return traveler;

  }
};

export default TravelerRepository;