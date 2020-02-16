import { recurrent } from 'brain.js';
import { PorterStemmer } from 'natural';
import * as fs from 'fs';
import * as path from 'path';
const { data } = require('./data.json');

const preparedData = data
  .map(({ question, answers }) => {
    if (answers[0] && answers[0].text) {
      return {
        input: question,
        output: answers[0].text,
      };
    }
    return false;
  })
  .filter(Boolean);

const lstm = new recurrent.LSTM();

function buildWordDictionary(trainingData) {
  const tokenisedArray = trainingData.map(item => {
    const tokens = item.input.split(' ');
    return tokens.map(token => PorterStemmer.stem(token));
  });

  const flattenedArray = [].concat.apply([], tokenisedArray);
  return flattenedArray.filter((item, pos, self) => self.indexOf(item) == pos);
}

function encode(phrase, dictionary) {
  const phraseTokens = phrase.split(' ');
  const encodedPhrase = dictionary.map(word =>
    phraseTokens.includes(word) ? 1 : 0
  );
  return encodedPhrase;
}

const dict = buildWordDictionary(preparedData);
const _prepData = preparedData.map(_data => {
  const { input, output } = _data;

  return {
    input: encode(input, dict),
    output,
  };
});
console.log('Input Data: ', _prepData);

lstm.train(_prepData, {
  iterations: 1500,
  log: (details: any) => console.log(details),
  errorThresh: 0.011,
});

fs.writeFileSync(
  path.join(__dirname, 'net.json'),
  JSON.stringify(lstm.toJSON())
);
console.log('Completed!');
