import computeCosineSimilarity from 'compute-cosine-similarity';
import DataSvc from './data-service';
import NeighborhoodModel from './models/neighborhood-model';
class LivabilityService {
  constructor() {
    this.neighborhoods = DataSvc.neighborhoods.map(n => new NeighborhoodModel(n));
  }

  /**
   * Calculate Livability
   *
   * Calculate the livability scores for each neighborhood in toronto compared to the user input.
   *
   * @param {Array<Number>} userModel An array of 10 Numbers which represent the user's preferences. [parks, wealth, house renters, house owners, family life, population, services, transit, culture, diversity ]
   * @param {{religion: string, ethnicity: string, language: string}} diversity Filter neighborhoods by specific characteristics
   * @param limit Specify the number of elements to return, if you want all enter 0
  */
  calculateLivability(userModel, diversity = null, limit = 5) {
    if (!Array.isArray(userModel) || !userModel.length === 10 || (Math.max(...userModel) > 10) || (Math.min(...userModel) < 0)) {
      return;
    }

    let results = {
      couldFilterByDiversity: true,
      neighborhoods: null
    };

    // Convert to NeighborhoodModel scale: 100
    userModel = userModel.map(val => val*10);

    let neighborhoodVectors = diversity ? this.neighborhoods.filter(n => {
      let religion = true;
      let ethnicity = true;
      let language = true;

      if (diversity.religion) {
        religion = n.includesReligion(diversity.religion.value);
      }

      if (diversity.ethnicity) {
        ethnicity = n.includesEthnicity(diversity.ethnicity.value);
      }

      if (diversity.language) {
        language = n.includesLanguage(diversity.language.value);
      }

      return religion && ethnicity && language;

    }).map(n => {
      return {
        id: n.id,
        name: n.name,
        similarity: computeCosineSimilarity(userModel, n.model)
      }
    }) : this.neighborhoods.map(n => {
      return {
        id: n.id,
        name: n.name,
        similarity: computeCosineSimilarity(userModel, n.model)
      }
    });

    // If Diversity is requested and there are no available neighborhoods set to the original neighborhoods without filter
    if (diversity && neighborhoodVectors.length === 0) {
      results.couldFilterByDiversity = false;
      neighborhoodVectors = this.neighborhoods.map(n => {
        return {
          id: n.id,
          name: n.name,
          similarity: computeCosineSimilarity(userModel, n.model)
        }
      });
    }


    // Limit the results
    if (limit === 0 || limit >= 140 || limit < 0 || typeof limit !== 'number') {
      return {
        couldFilterByDiversity: results.couldFilterByDiversity,
        neighborhoods: neighborhoodVectors.sort((a,b) => b.similarity-a.similarity)
      };
    }

    return {
      couldFilterByDiversity: results.couldFilterByDiversity,
      neighborhoods: neighborhoodVectors.sort((a,b) => b.similarity-a.similarity).slice(0, limit)
    };

  }
}

export default new LivabilityService();
