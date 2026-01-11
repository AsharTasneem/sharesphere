const { Country, State, City } = require("country-state-city");

console.log("Country PK:", Country.getCountryByCode("PK"));
const states = State.getStatesOfCountry("PK");
console.log("States count:", states.length);
if (states.length > 0) {
  console.log("First state:", states[0]);
  const cities = City.getCitiesOfState("PK", states[0].isoCode);
  console.log("Cities count for first state:", cities.length);
}
