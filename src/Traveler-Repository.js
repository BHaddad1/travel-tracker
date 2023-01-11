class TravelerRepository {
  constructor(allTravelerData) {
    this.allTravelerData = allTravelerData;
  }
  findTravelerById(id) {
    return this.allTravelerData.travelers.find(traveler => traveler.id === id);
  }
};

export default TravelerRepository;