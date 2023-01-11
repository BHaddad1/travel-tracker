import * as dayjs from 'dayjs'

class TripRepository {
  constructor(allTripData) {
    this.allTripData = allTripData;
  }
  filterByTravelerID(id) {
    return this.allTripData.filter((trip) => trip.userID === id);
  }
  filterTripsByStatus(status, id) {
    return this.filterByTravelerID(id).filter((trip) => trip.status === status);
  }
  findTripsByDate(id) {
    const today = dayjs("2021/12/31");
    return this.filterByTravelerID(id).filter((trip) => {
      let dateA = dayjs(trip.date);
      return dateA.isAfter(today);
    });
  }
}

export default TripRepository;
