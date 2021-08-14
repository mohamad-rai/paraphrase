const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { spinService } = require('../services');
const ApiError = require('../utils/ApiError');
const { fileParser } = require('../services/file.service');
const logger = require('../config/logger');

const spinText = catchAsync(async (req, res) => {
  const spin = await spinService.paraphrase(req.body.data);
  res.status(httpStatus.ACCEPTED).json({ spun: spin });
}); 
const synonyms = catchAsync(async (req, res) => {
  const p = `${req.body.lang}/${req.body.word}`
  const spin = await spinService.synonyms(p);
  res.status(httpStatus.ACCEPTED).json({ synonyms: spin });
});

const fakeSpinText = catchAsync(async (req, res) => {
  const highlightText = req.body.data.text.replace('&lt;', '<');
  const difference = [
    {
      "count": 6,
      "value": "Check out the "
    },
    {
      "count": 1,
      "removed": true,
      "value": "latest"
    },
    {
      "count": 1,
      "added": true,
      "value": "furthest"
    },
    {
      "count": 1,
      "value": " "
    },
    {
      "count": 1,
      "removed": true,
      "value": "additions"
    },
    {
      "count": 1,
      "added": true,
      "value": "down"
    },
    {
      "count": 1,
      "value": " "
    },
    {
      "count": 6,
      "added": true,
      "value": "the line augmentations "
    },
    {
      "count": 7,
      "value": "to the Nakamura \n"
    },
    {
      "count": 2,
      "added": true,
      "value": "<img"
    },
    {
      "count": 1,
      "value": " "
    },
    {
      "count": 5,
      "removed": true,
      "value": "{{IMG}}"
    },
    {
      "count": 25,
      "added": true,
      "value": "src = 'https://i1.sndcdn.com/artworks-ZSxNOiYfbz9Umo1r-tH2zGw-t200x200.jpg' >"
    },
    {
      "count": 2,
      "value": "Anthology "
    },
    {
      "count": 1,
      "removed": true,
      "value": "collection"
    },
    {
      "count": 1,
      "added": true,
      "value": "assortment"
    },
    {
      "count": 2,
      "value": ", "
    },
    {
      "count": 1,
      "removed": true,
      "value": "available"
    },
    {
      "count": 1,
      "added": true,
      "value": "accessible"
    },
    {
      "count": 11,
      "value": " now.nn﻿﻿The Hibana Eternity "
    },
    {
      "count": 1,
      "removed": true,
      "value": "bundle"
    },
    {
      "count": 1,
      "added": true,
      "value": "pack"
    },
    {
      "count": 25,
      "value": " includes the Wilderness Kimono uniform, the Wounded Immortal headgear, the Ligature "
    },
    {
      "count": 5,
      "removed": true,
      "value": "{{IMG}}"
    },
    {
      "count": 25,
      "added": true,
      "value": "<img src='https://i1.sndcdn.com/artworks-ZSxNOiYfbz9Umo1r-tH2zGw-t200x200.jpg'>"
    },
    {
      "count": 18,
      "value": "weapon skin for the TYPE-89.nn﻿﻿nnthe Ukigumo "
    },
    {
      "count": 1,
      "removed": true,
      "value": "charm"
    },
    {
      "count": 1,
      "added": true,
      "value": "enchant"
    },
    {
      "count": 57,
      "value": ". The Frost Protector Bundle includes the Paranormal Expert Uniform, the Eyeless Master headgear, the Written Incantation weapon skin for the 9mm C1, and the Perfect Balance "
    },
    {
      "count": 1,
      "removed": true,
      "value": "charm"
    },
    {
      "count": 1,
      "added": true,
      "value": "beguile"
    },
    {
      "count": 1,
      "value": "."
    }
  ];
  const spun = {highlightText: highlightText.split('\n').map(line => `</p>${line}</p>`), difference};

  res.status(httpStatus.ACCEPTED).json({ spun });
})

const spinFile = catchAsync(async (req, res) => {
  const { file } = req;
  if (!file) throw new ApiError(httpStatus.NOT_ACCEPTABLE, "file didn't upload");
  logger.info('file uploaded');
  const fileContent = await fileParser(file);
  req.body.data = {};
  req.body.data.text = fileContent;
  req.body.data.element = 'blaze';
  req.body.data.type = 0;
  const spin = await spinService.paraphrase(req.body.data);
  res.status(httpStatus.ACCEPTED).json({ spun: spin });
});

module.exports = {
  spinText,
  spinFile,
  fakeSpinText,
  synonyms,
};
