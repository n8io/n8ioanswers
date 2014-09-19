module.exports = function(app){
  var router = express.Router();

  router.param('intensity', function(req, res, next, intensity){
    var badParamMessage = INVALID_PARAM_MESSAGE.replace('{{param}}', 'intensity');

    intensity = (intensity || '').toLowerCase();

    if(['light','moderate', 'heavy'].indexOf(intensity) === -1){
      return res.status(400).json({message:badParamMessage + ' Must be of value: light, moderate, or heavy.'});
    }

    req.intensity = intensity;

    next();
  });

  router.param('latLong', function(req, res, next, latLong){
    var badParamMessage = INVALID_PARAM_MESSAGE.replace('{{param}}', 'latLong');

    var latLongRegEx = /^-?([0-8]?[0-9]|90)\.[0-9]{1,6},[" "]?-?((1?[0-7]?|[0-9]?)[0-9]|180)\.[0-9]{1,6}$/;

    if(!latLongRegEx.test(latLong)){
      return res.status(400).json({message:badParamMessage});
    }

    req.latitude = _.str.trim(latLong.split(',')[0]);
    req.longitude = _.str.trim(latLong.split(',')[1]);

    next();
  });

  router.param('apiKey', function(req, res, next, apiKey){
    var badParamMessage = INVALID_PARAM_MESSAGE.replace('{{param}}', 'apiKey');

    if(guid.isGuid(apiKey)){
      return res.status(400).json({message:badParamMessage});
    }

    req.apiKey = apiKey;

    next();
  });

  router
    .get('/raining/soon/:latLong/:apiKey', function(req, res, next){
      var options = {
        APIKey: req.apiKey
      };

      forecast = new Forecast(options);

      forecast.get(req.latitude, req.longitude, function(err, resp, weather){
        if(err){
          return res.status(500).json(err);
        }

        var willItRain = false;
        if(weather && weather.minutely && weather.minutely.data){
          willItRain = _.some(weather.minutely.data, function(wmd){
            return wmd.precipProbability >= 0.2 && wmd.precipIntensity >= 0.002;
          });
        }

        weather.status = willItRain;
        return res.status(willItRain ? 200 : 404).json(weather);
      });
    })
    .get('/raining/:intensity/:latLong/:apiKey', function(req, res, next){
      var options = {
        APIKey: req.apiKey
      };

      forecast = new Forecast(options);

      forecast.get(req.latitude, req.longitude, function(err, resp, weather){
        if(err){
          return res.status(500).json(err);
        }

        var isItRainingToASpecificIntensity = false;
        var targetMaxPrecipIntensity = 1.000000;
        var targetMinPrecipIntensity = 0.000001;
        var isRaining = weather && weather.currently && weather.currently.precipIntensity;

        if(req.intensity === 'light'){
          targetMinPrecipIntensity = 0.000001;
          targetMaxPrecipIntensity = 0.017000;
        }
        else if(req.intensity === 'moderate'){
          targetMinPrecipIntensity = 0.017001;
          targetMaxPrecipIntensity = 0.100000;
        }
        else if(req.intensity === 'heavy'){
          targetMinPrecipIntensity = 0.100001;
          targetMaxPrecipIntensity = 1.000000;
        }

        if(isRaining){
          isItRainingToASpecificIntensity = weather.currently.precipIntensity >= targetMinPrecipIntensity;
        }

        weather.status = isItRainingToASpecificIntensity;
        return res.status(isItRainingToASpecificIntensity ? 200 : 404).json(weather);
      });
    })
    .get('/raining/:latLong/:apiKey', function(req, res, next){
      var options = {
        APIKey: req.apiKey
      };

      forecast = new Forecast(options);

      forecast.get(req.latitude, req.longitude, function(err, resp, weather){
        if(err){
          return res.status(500).json(err);
        }

        var isItRaining = weather && weather.currently && weather.currently.precipIntensity;

        weather.status = isItRaining;

        return res.status(isItRaining ? 200 : 404).json(weather);
      });
    });

  app.use('/is/weather', router);
};