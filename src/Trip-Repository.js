class TripRepository {
  constructor(allTripData) {
    this.allTripData = allTripData;
  }
  filterByTravelerID(id) {
    return this.allTripData.filter(trip => trip.userID === id);
  }
  filterTripsByStatus(status, id) {
    return this.filterByTravelerID(id).filter(trip => trip.status === status);
  }
};

export default TripRepository;