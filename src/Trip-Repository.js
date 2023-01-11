import * as dayjs from "dayjs";

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
  findUpcomingTrips(id) {
    const today = dayjs("2021/12/31");
    return this.filterByTravelerID(id).filter(trip => {
      let dateA = dayjs(trip.date);
      return dateA.isAfter(today);
    });
  }
  findPastTrips(id) {
    const today = dayjs("2021/12/31");
    return this.filterByTravelerID(id).filter(trip => {
      let dateA = dayjs(trip.date);
      return dateA.isBefore(today);
    });
  }
};

export default TripRepository;
