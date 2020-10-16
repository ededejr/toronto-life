import stringSimilarity from 'string-similarity';
import neighborhoodDescriptions from '../data/neighborhood-desc';

/**
 * Get the most similar neighborhood profile to a given neighborhood Name
 * @param name - Name of neighborhood for comparison
 */
function matchesNeighborhoodName(name) {
  const score = stringSimilarity.findBestMatch(name, neighborhoodDescriptions.map(n => n.name));
  return neighborhoodDescriptions.find(({name}) => name === score.bestMatch.target);
}

/**
 * Get the most appropriate pretty descriptor for a neighborhood object
 * @param n - Neighborhood 
 */
function getClosestPrettyDescriptor(n) {
  const neighborhoodName = n.name;
  const descriptor = matchesNeighborhoodName(neighborhoodName) || neighborhoodDescriptions[Math.floor(Math.random()*neighborhoodDescriptions.length)];

  return descriptor;
}

function findMaxProperty(obj) {
  const keys = Object.keys(obj);
  let max = {
    attr: null,
    value: 0,
  }

  keys.forEach(k => {
    if (obj[k] > max.value) {
      max = {
        attr: k,
        value: obj[k]
      }
    }
  })

  return max;
}

class DataService {
  constructor() {
    this.neighborhoodJSON = require('../data/neighborhoods.json');
    this.neighborhoods = Object.keys(this.neighborhoodJSON).map(x => {
      const item = this.neighborhoodJSON[x];
      item['prettyDescriptor'] = getClosestPrettyDescriptor(this.neighborhoodJSON[x]);
      return item;
    });
    this.toronto = this.neighborhoods.shift();
    this.generalRanges = null;
  }

  get neighborhoodList() {
    return this.neighborhoods.map(x => {
      return {
        name: x.name,
        id: x.neighborhoodID,
        area: x.area
      }
    });
  }

  get diversityOptions() {
    const filterBank = [
      'Language spoken most often at home for the total population excluding institutional residents',
      'Official languages',
      'Non-official languages',
      'Non-Aboriginal languages',
      'Multiple responses',
      'English and non-official language',
      'Semitic languages, n.i.e.'
    ]

    const options = {
      languages: [],
      religions: [],
      ethnicities: []
    }

    this.neighborhoods.forEach(n => {
      options.languages.push(Object.keys(n.languages.home).filter(language => !filterBank.includes(language)));
      options.ethnicities.push(Object.keys(n.ethnicOrigin));
      options.religions.push(Object.keys(n.placesOfWorship).filter(x => n.placesOfWorship[x] > 0));
    });

    options.languages = Array.from(new Set([].concat.apply([], options.languages)));
    options.religions = Array.from(new Set([].concat.apply([], options.religions)));
    options.ethnicities = Array.from(new Set([].concat.apply([], options.ethnicities)));
    return options;
  }

  getNeighborhoodById(id) {
    id = typeof(id) != 'string' ? String(id) : id;
    return this.neighborhoodJSON[id];
  }

  getNeighborhoodName(id) {
    id = typeof(id) != 'string' ? String(id) : id;
    return this.neighborhoodJSON[id].name;
  }

  getNeighborhoodArea(id) {
    id = typeof(id) != 'string' ? String(id) : id;
    return this.neighborhoodJSON[id].area;
  }

  getNeighborhoodStations(id) {
    id = typeof(id) != 'string' ? String(id) : id;
    const hood = this.neighborhoodJSON[id];
    return {
      police: hood.policeStations,
      fire: hood.fireStations,
      ambulance: hood.ambulanceStations
    }
  }

  getNeighborhoodTransitMethodStats(id) {
    id = typeof(id) != 'string' ? String(id) : id;
    const hood = this.neighborhoodJSON[id].transit.transitMethod;
    const totalUsers = Object.keys(hood).reduce((sum,key)=>sum+parseFloat(hood[key]||0),0);
    return {
      bicycle: (hood['Bicycle']/totalUsers) * 100 || null,
      car: (hood['driver']/totalUsers) * 100 || null,
      carPassenger: (hood['passenger']/totalUsers) * 100 || null,
      other: (hood['Other method']/totalUsers) * 100 || null,
      publicTransit: (hood['Public transit']/totalUsers) * 100 || null,
      walk: (hood['Walked']/totalUsers) * 10 || null
    }
  }

  getMostSpokenLanguage(id) {
    const filterBank = [
      'Language spoken most often at home for the total population excluding institutional residents',
      'Official languages',
      'Non-official languages',
      'Non-Aboriginal languages',
      'Multiple responses',
      'English and non-official language',
      'Semitic languages, n.i.e.'
    ]

    const n = this.getNeighborhoodById(id);
    const acceptedKeys = Object.keys(n.languages.home).filter(x => !filterBank.includes(x));

    const langObj = {}

    acceptedKeys.forEach(k => {
      langObj[k] = n.languages.home[k];
    })

    return findMaxProperty(langObj);
  }

  getMostPopularEducationLevel(id) {
    const n = this.getNeighborhoodById(id);
    return findMaxProperty(n.educationLevels);
  }

  getMostPopularEthnicity(id) {
    const n = this.getNeighborhoodById(id);
    return findMaxProperty(n.ethnicOrigin);
  }

  getMostCommonEmployment(id) {
    const n = this.getNeighborhoodById(id);
    return findMaxProperty(n.employment);
  }

  _getMaxMinValues(arr) {
    arr = arr.filter(x => x);
    return {
      max: Math.max(...arr),
      min: Math.min(...arr)
    }
  }

  get GeneralAttrRanges() {
    if (this.generalRanges) {
      return this.generalRanges;
    }

    const ranges = {
      policeStations: null,
      fireStations: null,
      ambulanceStations: null,
      bicycleParking: null,
      retirementHomes: null,
      culturalSpaces: null
    }

    Object.keys(ranges).forEach(attr => {
      const values = this.neighborhoods.map(x => x[attr]);  
      ranges[attr] = {
        max: Math.max(...values),
        min: Math.min(...values)
      };
    });

    return ranges;
  }

  retrievePopulationRange() {
    return this._getMaxMinValues(this.neighborhoods.map(x => Number(x['population']['Population, 2016'])))
  }

  // Get the park ranges according to coverage area
  retrieveParksRange() {
    return this._getMaxMinValues(this.neighborhoods.map(x => x.parks.coverage));
  }

  retrieveHousingOwnRange() {
    return this._getMaxMinValues(this.neighborhoods.map(x => x.housing.Owner));
  }

  retrieveHousingRentRange() {
    return this._getMaxMinValues(this.neighborhoods.map(x => x.housing.Renter));
  }

  retrieveFamilyLifeRanges() {
    const neighborhood = this.neighborhoods.map(n => {
      return {
        children: Number(n.population['Children (0-14 years)']),
        elementary: n.schools.elementary,
        secondary: n.schools.secondary,
        university: n.schools.university,
        youthServices: n.youthServices
      }
    });

    return {
      childrenPop: this._getMaxMinValues(neighborhood.map(i => i.children)),
      elementary: this._getMaxMinValues(neighborhood.map(i => i.elementary)),
      secondary: this._getMaxMinValues(neighborhood.map(i => i.secondary)),
      university: this._getMaxMinValues(neighborhood.map(i => i.university)),
      youthServices: this._getMaxMinValues(neighborhood.map(i => i.youthServices)) 
    }
  }

  retrieveTransitRanges() {
    return this._getMaxMinValues(this.neighborhoods.map(x => x.transit.transitMethod['Public transit']))
  }

  retrieveCultureRanges() {
    const neighborhood = this.neighborhoods.map(n => {
      return {
        culturalSpaces: n.culturalSpaces,
        languages: Object.keys(n.languages.home).filter(language => language !== 'Language spoken most often at home for the total population excluding institutional residents' || language !== 'Official languages').length,
        ethnicOrigins: Object.keys(n.ethnicOrigin).length,
        religion: Object.keys(n.placesOfWorship).filter(x => n.placesOfWorship[x] > 0).length
      }
    });
    
    return {
      culturalSpaces: this._getMaxMinValues(neighborhood.map(i => i.culturalSpaces)),
      languages: this._getMaxMinValues(neighborhood.map(i => i.languages)),
      ethnicOrigins: this._getMaxMinValues(neighborhood.map(i => i.ethnicOrigins)),
      religion: this._getMaxMinValues(neighborhood.map(i => i.religion))
    }
  }


  retrieveWealthRanges() {
    const neighborhood = this.neighborhoods.map(n => {
      const incomeBrackets = this.discoverIncomeBrackets(n.income);
      return {
        houseOwners: n.housing.Owner,
        employed: n.employment.Employed,
        householdIncome: incomeBrackets.individuals,
        individualIncome: incomeBrackets.households
      }
    });

    function getMinMaxForIncomes(fn, brackets) {
      return {
        low: fn(brackets.map(b => b.low)),
        middle: fn(brackets.map(b => b.middle)),
        high: fn(brackets.map(b => b.high))
      }    
    }

    return {
      houseOwners: this._getMaxMinValues(neighborhood.map(i => i.houseOwners)),
      employed: this._getMaxMinValues(neighborhood.map(i => i.employed)),
      householdIncome: getMinMaxForIncomes(this._getMaxMinValues, neighborhood.map(i => i.householdIncome)),
      individualIncome: getMinMaxForIncomes(this._getMaxMinValues, neighborhood.map(i => i.individualIncome))
    }
  }

  // Separate Income earners into upper class, middle class and lower class
  // We may need to find income thresholds for high, middle, low
  discoverIncomeBrackets(income) {
    function getThresholds(i) {
      return Object.keys(i).map(range => {
        let r = range.split(' ');
        r = r[0] === 'Under' ? '$0' : r[0];
        r = Number(r.replace('$', '').replace(/,/g, ''));
  
        return {
          key: range,
          threshold: r
        }
      });
    }

    const individual = income.individuals;
    const household = income.households;
    const individualRanges = getThresholds(individual);
    const householdRanges = getThresholds(household);

    const individualBrackets = {
      low: 0,
      middle: 0,
      high: 0
    }

    const householdBrackets = {
      low: 0,
      middle: 0,
      high: 0
    }

    individualRanges.forEach(i => {
      if (i.threshold < 30000) {
        individualBrackets.low += individual[i.key];
      } else if (i.threshold < 80000) {
        individualBrackets.middle += individual[i.key];
      } else {
        individualBrackets.high += individual[i.key];
      }
    });

    householdRanges.forEach(i => {
      if (i.threshold < 60000) {
        householdBrackets.low += household[i.key];
      } else if (i.threshold < 150000) {
        householdBrackets.middle += household[i.key];
      } else {
        householdBrackets.high += household[i.key];
      }
    });

    return {
      individuals: individualBrackets,
      households: householdBrackets
    }
  }
}


export default new DataService();