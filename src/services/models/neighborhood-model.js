import DataSvc from '../data-service';

export default class NeighborhoodModel {
  constructor(neighborhood) {
    this.rawData = neighborhood;
    this.scale = 100;
  }

  get name() {
    return this.rawData.name;
  }

  get id() {
    return this.rawData.neighborhoodID;
  }

  // Return a vector that we can use to calculate similarity
  get model() {
    return [
      this.calculateParks() ,
      this.calculateWealth(),
      this.calculateHousingRent(),
      this.calculateHousingOwn(),
      this.calculateFamilyLife(),
      this.calculatePopulation(),
      this.calculateServices(),
      this.calculateTransit(),
      this.calculateCulture(),
      this.calculateDiversity()
    ];
  }

  calculateParks() {
    return this._calculateNormalizedScore(this.rawData.parks.coverage, DataSvc.retrieveParksRange()) * this.scale;
  }

  calculateWealth() {
    const {employed, houseOwners, householdIncome, individualIncome} = DataSvc.retrieveWealthRanges();
    const incomeBrackets = DataSvc.discoverIncomeBrackets(this.rawData.income);

    // Calculate Household Income score
    const household_lowIncomeScore = this._calculateNormalizedScore(incomeBrackets.households.low, householdIncome.low);
    const household_middleIncomeScore = this._calculateNormalizedScore(incomeBrackets.households.middle, householdIncome.middle) * 2;
    const household_highIncomeScore = this._calculateNormalizedScore(incomeBrackets.households.high, householdIncome.high) * 4;

    // Calculate Individual Income Score
    const individual_lowIncomeScore = this._calculateNormalizedScore(incomeBrackets.individuals.low, individualIncome.low);
    const individual_middleIncomeScore = this._calculateNormalizedScore(incomeBrackets.individuals.middle, individualIncome.middle) * 2;
    const individual_highIncomeScore = this._calculateNormalizedScore(incomeBrackets.individuals.high, individualIncome.high) * 4;

    const employmentScore = this._calculateNormalizedScore(this.rawData.employment.Employed, employed);
    const houseOwnerScore = this._calculateNormalizedScore(this.rawData.housing.Owner, houseOwners);
    const householdScore = ((household_highIncomeScore + household_middleIncomeScore + household_lowIncomeScore)/7);
    const individualScore = ((individual_highIncomeScore + individual_middleIncomeScore + individual_lowIncomeScore)/7);
    return ((employmentScore + houseOwnerScore + householdScore + individualScore)/4) * this.scale;
  }

  calculateHousingRent() {
    return this._calculateNormalizedScore(this.rawData.housing.Renter, DataSvc.retrieveHousingRentRange()) * this.scale;
  }

  calculateHousingOwn() {
    return this._calculateNormalizedScore(this.rawData.housing.Owner, DataSvc.retrieveHousingOwnRange()) * this.scale;
  }

  calculateFamilyLife() {
    const {childrenPop, elementary, secondary, university, youthServices} = DataSvc.retrieveFamilyLifeRanges();
    const childrenScore = this._calculateNormalizedScore(Number(this.rawData.population['Children (0-14 years)']), childrenPop);
    const elementaryScore = this._calculateNormalizedScore(this.rawData.schools.elementary, elementary);
    const secondaryScore = this._calculateNormalizedScore(this.rawData.schools.secondary, secondary);
    const universityScore = this._calculateNormalizedScore(this.rawData.schools.university, university);
    const youthScore = this._calculateNormalizedScore(this.rawData.youthServices, youthServices);
    return ((childrenScore + elementaryScore + secondaryScore + universityScore + youthScore)/5) * this.scale;
  }

  calculatePopulation() {
    const range = DataSvc.retrievePopulationRange();
    const thisPopulation = this.rawData.population['Population, 2016'];
    return this._calculateNormalizedScore(thisPopulation, range) * this.scale;
  }

  calculateServices() {
    const {fireStations, ambulanceStations, policeStations } = DataSvc.GeneralAttrRanges;
    const fireScore = this._calculateNormalizedScore(this.rawData.fireStations, fireStations);
    const policeScore = this._calculateNormalizedScore(this.rawData.policeStations, policeStations);
    const ambulanceScore = this._calculateNormalizedScore(this.rawData.ambulanceStations, ambulanceStations);
    return ((fireScore + policeScore + ambulanceScore)/3) * this.scale;
  }

  calculateTransit() {
    return this._calculateNormalizedScore(this.rawData.transit.transitMethod['Public transit'], DataSvc.retrieveTransitRanges()) * this.scale;
  }

  calculateCulture() {
    const {languages, culturalSpaces, ethnicOrigins} = DataSvc.retrieveCultureRanges();

    const languageCount = Object.keys(this.rawData.languages.home).filter(language => language !== 'Language spoken most often at home for the total population excluding institutional residents' || language !== 'Official languages').length;
    const ethnicOriginCount = Object.keys(this.rawData.ethnicOrigin).length;

    const languageScore = this._calculateNormalizedScore(languageCount, languages);
    const ethnicScore = this._calculateNormalizedScore(ethnicOriginCount, ethnicOrigins);
    const cultureSpaceScore = this._calculateNormalizedScore(this.rawData.culturalSpaces, culturalSpaces);

    return ((languageScore + ethnicScore + cultureSpaceScore)/3) * this.scale;
  }

  calculateDiversity() {
    const {languages, ethnicOrigins, religion} = DataSvc.retrieveCultureRanges();

    const languageCount = Object.keys(this.rawData.languages.home).filter(language => language !== 'Language spoken most often at home for the total population excluding institutional residents' || language !== 'Official languages').length;
    const ethnicOriginCount = Object.keys(this.rawData.ethnicOrigin).length;
    const religionCount = Object.keys(this.rawData.placesOfWorship).filter(x => this.rawData.placesOfWorship[x] > 0).length;

    const languageScore = this._calculateNormalizedScore(languageCount, languages);
    const ethnicScore = this._calculateNormalizedScore(ethnicOriginCount, ethnicOrigins);
    const religionScore = this._calculateNormalizedScore(religionCount, religion);

    return ((languageScore + ethnicScore + religionScore)/3) * this.scale;
  }

  // Calculate normalized score
  _calculateNormalizedScore(val, rangeObj) {
    if (!val) {
      return 0;
    }
    return (val - rangeObj.min)/(rangeObj.max - rangeObj.min);
  }

  // Check that neighborhood has relgion
  _matchesReligion(religion) {
    return Object.keys(this.rawData.placesOfWorship).filter(r => this.rawData.placesOfWorship[r] !== 0).map(l => l.toLowerCase()).includes(religion.toLowerCase());
  }

  // Check that religion is most dominant in neighborhood
  isDominantReligion(religion) {
    if (!this._matchesReligion(religion)) {
      return false;
    }
    const groups = this.rawData.placesOfWorship;
    const values = Object.values(groups);
    const max = Math.max(...values);
    return Object.keys(groups).filter(x => groups[x] === max).includes(religion);
  }

  includesReligion(religion = '') {
    return Object.keys(this.rawData.placesOfWorship)
      .filter(x => this.rawData.placesOfWorship[x] > 0)
      .map(x => x.toLowerCase()).includes(religion.toLowerCase());
  }


  // Check that the requested language matches the requested language
  _matchesLanguage(language) {
    return Object.keys(this.rawData.languages.native).map(l => l.toLowerCase()).includes(language.toLowerCase());
  }

  // Check if the language is the most dominant or one of the most dominant languages in the neighbourhhod
  isDominantLanguage(language) {
    if (!this._matchesLanguage(language)) {
      return false;
    }
    const langs = this.rawData.languages.native;

    // Remove the general attributes
    langs['Single responses'] = 0;
    langs['Official languages'] = 0;
    langs['Non-Aboriginal languages'] = 0;
    langs['Non-official languages'] = 0;

    const values = Object.values(langs);
    const max = Math.max(...values);

    return Object.keys(langs).filter(x => langs[x] === max).map(x => x.toLowerCase()).includes(language.toLowerCase());
  }

  includesLanguage(language = '') {
    return Object.keys(this.rawData.languages.native)
      .map(x => x.toLowerCase())
      .includes(language.toLowerCase());
  }

  // Check if the neighborhood has the requested ethnicity
  _matchesEthnicity(ethnicity) {
    return Object.keys(this.rawData.ethnicOrigin).map(l => l.toLowerCase()).includes(ethnicity.toLowerCase());
  }

  // Check that ethnicity is the most dominant in neighborhood
  isDominantEthnicity(ethnicity) {
    if (!this._matchesEthnicity(ethnicity)) {
      return false;
    }
    const groups = this.rawData.ethnicOrigin;
    const values = Object.values(groups);
    const max = Math.max(...values);
    return Object.keys(groups).filter(x => groups[x] === max).includes(ethnicity);
  }

  includesEthnicity(ethnicity = '') {
    return Object.keys(this.rawData.ethnicOrigin).filter(x => this.rawData.ethnicOrigin[x] > 0).map(x => x.toLowerCase()).includes(ethnicity.toLowerCase());
  }
}