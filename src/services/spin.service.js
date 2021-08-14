const axios = require('axios');
const httpStatus = require('http-status');
const diff = require('diff');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const { spinConfig } = require('../config/spin');

const classification = (spinType) => {
  const formUrlEncoded = (x) => {
    return Object.keys(x).reduce((p, c) => `${p}&${c}=${encodeURIComponent(x[c])}`, '');
  };

  const data = {
    optimized: {
      url: spinConfig.OPTIMIZED,
      query: formUrlEncoded({
        spinner: spinType.type,
        text: spinType.text,
        header: {},
      }),
    },
    blaze: {
      url: spinConfig.BLAZE,
      query: spinType.text,
      header: {
        'x-auth-key': process.env.SPIN_TOKEN,
        'x-multi-creds': 'true',
        'x-min-percent-change-per-sentence': spinType.percent || 'any'
      },
    },
  };
  if(spinType.ignore && spinType.ignore.length) data.blaze.header['x-words-to-skip'] = spinType.ignore.join(',');

  return data[spinType.element];
};
const spin = (spinType) => {
  return new Promise((resolve, reject) => {
    const classify = classification(spinType);
    axios
      .post(classify.url, classify.query, { headers: classify.header })
      .then((spinnedText) => {
        resolve(spinnedText);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const synonyms = (partialUri) => {
  return new Promise((resolve, reject) => {
    const shuffle = (arr)=>{
      return arr[0].meanings.map(e=> (e.definitions.map(w=> w.synonyms.map(t=>({word: t, type: e.partOfSpeech}))).flat(2))).flat()
    }
    const uri = `https://api.dictionaryapi.dev/api/v2/entries/${partialUri}`;
    axios
      .get(uri)
      .then((allSynonyms) => {
        console.log(allSynonyms.data)
        resolve(shuffle(allSynonyms.data));
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const diffSpunWithSpin = (beforeText, afterText) => {
  const difference = diff.diffWords(beforeText, afterText);
  let highlightText = '';
  for(let word of difference) {
    if(word.value === '') {
      highlightText += '\n';
      continue;
    }
    highlightText +=
        word.added ?
            `<span class="spun-word cursor-pointer">${word.value}</span>` :
            word.removed ?
                '' :
                word.value + ' ';
  }
  const arrayText = highlightText.split('\n').map(line => `${line}`);
  return {difference, highlightText: arrayText,highlightTextParagraph: afterText};
}

/**
 * request for spin
 * @param {Object} userData
 * @returns {Promise<{spun: string, difference: (*|boolean)}>}
 */
const paraphrase = async (userData) => {
  try {
    const imageRegx = /<img.*?src\s?=\s?["|'].*?["|']?[^\>]+>/gm;
    const srcRegx = /.*src="([^"]*)".*/;
    userData.text = userData.text.split('&lt;').join('<');
    const textLines = userData.text.split('\n');
    const imagesObj = [];
    textLines.forEach((line, ind) => {
      const foundImage = line.match(imageRegx);
      if (foundImage) {
        const link = foundImage.map((x) => x.replace(srcRegx, '$1'));
        textLines[ind] = line.replace(imageRegx, '{{IMG}}');
        imagesObj.push({ line: ind, link });
      }
    });
    const spunText = await spin({
      element: userData.element,
      type: userData.type,
      text: textLines.join('\n'),
      ignore: userData.ignore,
      percent: userData.percent,
    });
    let d = spunText.data;
    d = (d.text || d).split('\n').filter(line => line);
    imagesObj.forEach((img) => {
      img.link.forEach(i => {
        d[img.line] = d[img.line].replace('{{IMG}}', i);
      })
    });
    d = `${d.join('\n')}`;
    return diffSpunWithSpin(textLines.join('\n'),d.split('&lt;').join('<'));
  } catch (err) {
    logger.error(err.message);
    if (err.statusCode) throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Captcha failed');
    throw new ApiError(500, 'Server Error');
  }
};

module.exports = {
  paraphrase,
  synonyms
};
