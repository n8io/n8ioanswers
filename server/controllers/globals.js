express = require('express');
app = express();
moment = require('moment');
_ = require('lodash');
_.str = require('underscore.string');
guid = require('guid');
Forecast = require('forecast.io');

INVALID_PARAM_MESSAGE = '{{param}} parameter is not valid.';