import * as dayjs from "dayjs";

class TripRepository {
  constructor(allTripData, destinationData) {
    this.tripData = allTripData;
    this.destinationData = destinationData;
  }
  filterByTravelerID(id) {
    return this.tripData.filter(trip => trip.userID === id);
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
  findDestinationByName(name) {
    const foundDestination = this.destinationData.find((destination) => destination.destination === name);
    if (!foundDestination) {
      return "No such destination.";
    }
    return foundDestination;
  }
  calculateCostOfTrip(travelerID) {
    // find a travelers trips
    // find one trip
    // find destination
    // get stats from destination
    // do math 
  }
  calculateCostPerYear(travelerID) {
    const travelersTrips = this.filterByTravelerID(travelerID);
    const tripsThisYear = travelersTrips.filter(trip => {
      const splitDate = trip.date.split("/");
      const year = splitDate[0];
      return year === "2021";
    })
    const thisYearsDestinations = tripsThisYear.map(trip => trip.destinationID).reduce((acc, cur) => {
      this.destinationData.forEach(dest => {
        if (dest.id === cur) {
          acc.push(dest);
        };
      });
      return acc;
    }, []);
    const total = tripsThisYear.reduce((acc, cur) => {
      const overlap = thisYearsDestinations.find(dest => dest.id === cur.destinationID)
      acc += (overlap.estimatedLodgingCostPerDay * cur.duration) * 1.1;
      acc += (overlap.estimatedFlightCostPerPerson * cur.travelers) *  1.1;
      return acc;
    }, 0)
    return Number(total.toFixed(0));
  }
};

export default TripRepository;
