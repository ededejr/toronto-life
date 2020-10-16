/**
 * Livability Service Tests
 * 
 * This module tests the livability calculation for correctness.
 * 
 */
import LivabilitySvc from '../services/livability-service.js';

it('runs the livability service', () => {
  /** Make the lists of tests */
  const listOfTests = [
    {
      input: [10,10,5,5,5,4,9,2,2,8],
      desc: 'Wealthy neighborhood with high park coverage, high diversity, and good services',
      result: null,
    },
    {
      input: [10,5,5,5,5,5,9,5,5,5],
      desc: 'neighborhood with high park coverage and great services, but neutral other factors',
      result: null,
    },
    {
      input: [10,5,5,5,5,5,9,5,5,3],
      desc: 'neighborhood with high park coverage and great services, but neutral other factors, low diversity and wanting catholic',
      diversity: {religion: 'catholic'},
      result: null,
    },
    {
      input: [10,0,5,5,5,5,9,5,5,5],
      desc: 'Poor neighborhood with high park coverage and great services, but neutral other factors',
      result: null,
    },
    {
      input: [10,5,5,5,5,5,5,9,5,5],
      desc: 'neighborhood with high park coverage and great transit, but neutral other factors',
      result: null,
    },
    {
      input: [10,5,5,5,5,5,5,9,5,2],
      desc: 'neighborhood with high park coverage and great transit, low diversity and wanting polish ethnicity',
      diversity: {ethnicity: 'polish'},
      result: null,
    },
    {
      input: [10,1,5,5,8,5,10,9,5,5],
      desc: 'Poor neighborhood with high park coverage and great transit, great services and good family life',
      result: null,
    },
    {
      input: [10,9,2,8,9,5,10,9,5,5],
      desc: 'Wealthy neighborhood with high park coverage and great transit, great services and good family life, prefer own',
      result: null,
    },
    {
      input: [10,5,9,1,5,5,5,5,9,8],
      desc: 'neighborhood with high park coverage, great culture and high diversity, prefer rent, neutral other factors',
      result: null,
    },
    {
      input: [10,5,10,0,5,5,5,5,5,1],
      desc: 'neighborhood with high park coverage, prefer rent, low diversity want korean, neutral other factors ',
      diversity: {language: 'korean'},
      result: null,
    },
    // PREFER OWN
    // -- Wealthy
    {
      input: [10,8,0,10,5,7,5,5,6,6],
      desc: 'Wealthy neighborhood with high park coverage, prefer own, neutral other factors',
      result: null,
    },
    // -- Poor
    {
      input: [10,3,0,10,5,7,5,5,6,6],
      desc: 'Poor neighborhood with high park coverage, prefer own, neutral other factors',
      result: null,
    },
    // -- High Population
    {
      input: [5,5,0,10,5,10,5,5,6,6],
      desc: 'neighborhood with high population, prefer own, neutral other factors',
      result: null,
    },
    // -- Population Neutral
    {
      input: [5,5,0,10,5,5,8,5,6,6],
      desc: 'neighborhood with high services, prefer own, neutral other factors',
      result: null,
    },
    // -- Low Population
    {
      input: [6,5,0,10,5,7,2,5,6,6],
      desc: 'neighborhood with low population, prefer own, neutral other factors',
      result: null,
    },
    // low diversity
    {
      input: [5,5,0,10,5,5,5,5,5,1],
      desc: 'neighborhood with a ethnicity of polish,prefer own, neutral other factors',
      diversity: {ethnicity:'polish'},
      result: null,
    },
    {
      input: [5,5,0,10,5,5,5,5,5,2],
      desc: 'neighborhood with a religion of catholic, prefer own, neutral other factors',
      diversity: {religion: 'catholic'},
      result: null,
    },
    {
      input: [5,5,0,10,5,5,5,5,5,3],
      desc: 'neighborhood with muslim religion, pakistani ethnicity, prefer own, neutral other factors',
      diversity: {religion: 'muslim', ethnicity:'pakistani'},
      result: null,
    },
    {
      input: [8,8,0,10,8,8,8,8,8,3],
      desc: 'neighborhood with a language of chinese, high requirements of other factors, prefer own',
      diversity: {language:'chinese'},
      result: null,
    },
    {
      input: [2,3,0,10,4,3,2,2,2,4],
      desc: 'neighborhood with an ethnicity of irish, language of frenchm low requirements of other factors, prefer own',
      diversity: {ethnicity:'irish',language:'french'},
      result: null,
    },
    // PREFER RENT
    // -- Wealthy
    {
      input: [5,9,10,0,5,5,5,5,5,5],
      desc: 'Want rent wealthy neighborhood, neutral other factors',
      result: null,
    },
    {
      input: [5,9,10,0,5,8,5,5,5,5],
      desc: 'Want rent wealthy neighborhood with high population, neutral other factors',
      result: null,
    },
    {
      input: [5,9,10,0,5,1,5,5,5,5],
      desc: 'Want rent wealthy neighborhood with low population, neutral other factors',
      result: null,
    },
    {
      input: [5,9,10,0,5,5,5,5,5,2],
      desc: 'Want rent wealthy neighborhood, low diversity, ethnicity pakistani',
      diversity: {ethnicity: 'pakistani'},
      result: null,
    },
    {
      input: [3,8,8,2,4,5,4,9,8,5],
      desc: 'Want rent wealthy neighborhood with great transit and cultrue',
      result: null,
    },
    {
      input: [4,7,7,3,8,5,4,4,3,9],
      desc: 'Want rent wealthy neighborhood with great family life and high diversity',
      result: null,
    },
    {
      input: [8,9,8,2,4,3,9,4,3,5],
      desc: 'Want rent wealthy neighborhood with high park coverage, low population and good service',
      result: null,
    },
    {
      input: [10,10,9,1,10,5,9,10,8,9],
      desc: 'Want rent wealthy neighborhood with high park coverage, great family life, great transit, great culture, high diversity and great service',
      result: null,
    },
    {
      input: [3,9,10,0,9,5,4,7,3,2],
      desc: 'Want rent wealthy neighborhood with great family life, good transit and low deiversity with language chinese',
      diversity: {language: 'chinese'},
      result: null,
    },
    // -- Wealth Neutral
    {
      input: [5,5,10,0,5,5,5,5,5,5],
      desc: 'Want rent neighborhood all neutral',
      result: null,
    },
    {
      input: [5,5,9,1,5,5,5,5,5,3],
      desc: 'Want rent neighborhood, low diversity with religion jewish',
      diversity: {religion: 'catholic'},
      result: null,
    },
    {
      input: [3,5,7,3,4,5,4,8,3,9],
      desc: 'Want rent neighborhood with great transit and high diversity',
      result: null,
    },
    {
      input: [5,5,9,1,8,5,8,4,3,2],
      desc: 'Want rent neighborhood with good service and family life, low diversity with language french',
      diversity: {language: 'french'},
      result: null,
    },
    {
      input: [10,5,10,0,10,5,9,9,8,10],
      desc: 'Want rent wealthy neighborhood with high park coverage, great family life, great transit, great culture, high diversity and great service',
      result: null,
    },
    // -- Poor
    {
      input: [5,1,10,0,5,5,5,5,5,5],
      desc: 'Want rent poor neighborhood, neutral other factors',
      result: null,
    },
    {
      input: [5,3,8,2,5,10,5,5,5,5],
      desc: 'Want rent poor neighborhood with high population, neutral other factors',
      result: null,
    },
    {
      input: [9,2,8,2,4,5,9,7,3,5],
      desc: 'Want rent poor neighborhood with great transit, service and high park coverage',
      result: null,
    },
    {
      input: [2,1,10,0,5,4,5,3,8,2],
      desc: 'Want rent poor neighborhood with good culture, low diversity, ethnicity spanish',
      diversity: {ethnicity: 'spanish'},
      result: null,
    },
    {
      input: [10,0,10,0,10,5,10,10,10,10],
      desc: 'Want rent poor neighborhood with high park coverage, great family life, great transit, great culture, high diversity and great service',
      result: null,
    },
    {
      input: [4,2,7,3,8,3,3,4,5,10],
      desc: 'Want rent poor neighborhood with great family life, low population and high diversity',
      result: null,
    },
    // -- High Population
    {
      input: [5,5,10,0,5,10,5,5,5,5],
      desc: 'Want rent neighborhood with high population, neutral other factors',
      result: null,
    },
    {
      input: [5,5,10,0,5,9,5,5,5,3],
      desc: 'Want rent neighborhood with high population, low diversity with religion muslim',
      diversity: {religion: 'muslim'},
      result: null,
    },
    {
      input: [4,5,10,0,5,8,8,9,7,5],
      desc: 'Want rent neighborhood with high population, great transit, culture and services',
      result: null,
    },
    {
      input: [2,5,8,2,8,10,4,3,5,9],
      desc: 'Want rent neighborhood with high population, good family life and high diversity',
      result: null,
    },
    {
      input: [10,10,9,1,10,9,9,10,9,8],
      desc: 'Want rent neighborhood with high population, high park coverage, great family life, great transit, great culture, high diversity and great service',
      result: null,
    },
    {
      input: [3,5,7,3,7,9,5,8,4,5],
      desc: 'Want rent neighborhood with high population, good transit and family life, low diversity with language mandarin',
      diversity: {language: 'mandarin'},
      result: null,
    },
    // -- Population Neutral
    {
      input: [4,5,9,1,4,5,4,9,5,8],
      desc: 'Want rent neighborhood with neutral population, good transit and high diversity',
      result: null,
    },
    {
      input: [8,5,10,0,4,5,8,3,5,2],
      desc: 'Want rent neighborhood with neutral population, high park coverage, good service and low diversity with ethnicity Irish',
      diversity: {ethnicity: 'irish'},
      result: null,
    },
  ];

  listOfTests.forEach(test => {
    if (test.diversity) {
      console.log('************************\n');
      console.log(test.desc);
      console.log(LivabilitySvc.calculateLivability(test.input, test.diversity, 1));
    } else {
      console.log('************************\n');
      console.log(test.desc);
      console.log(LivabilitySvc.calculateLivability(test.input, null, 1));
    }
  });
})
