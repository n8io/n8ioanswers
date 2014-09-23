module.exports = function(app){
  var defaultStartTimeInMinutes = 8*60;
  var defaultEndTimeInMinutes = 17*60;
  var defaultTimezone = 'America/New_York';

  var router = express.Router();

  router.param('sm', function(req, res, next, sm){
    var badParamMessage = INVALID_PARAM_MESSAGE.replace('{{param}}', 'starting time in minutes');

    sm = (sm || defaultStartTimeInMinutes).toLowerCase();

    if(parseInt(sm, 0) <= 0 || parseInt(sm, 0) > 3600){
      return res.status(400).json({message:badParamMessage});
    }

    req.startTimeInMinutes = parseInt(sm, 0);

    next();
  });

  router.param('em', function(req, res, next, em){
    var badParamMessage = INVALID_PARAM_MESSAGE.replace('{{param}}', 'ending time in minutes');

    em = (em || defaultEndTimeInMinutes).toLowerCase();

    if(parseInt(em, 0) <= 0 || parseInt(em, 0) > 3600){
      return res.status(400).json({message:badParamMessage});
    }

    req.endTimeInMinutes = parseInt(em, 0);

    next();
  });

  router.param('timezone', function(req, res, next, timezone){
    console.log('Parsing parameter: timezone', timezone);
    var badParamMessage = INVALID_PARAM_MESSAGE.replace('{{param}}', 'timezone');

    var timezones = _.map(moment.tz.names(), function(tz, i){
      return {
        id: tz.toLowerCase(),
        value: tz,
        index: i
      };
    });

    timezone = (timezone || defaultTimezone).toLowerCase();

    if(!_(timezones).some({id:timezone})){
      return res.status(400).json({message:badParamMessage});
    }

    req.timezone = _.findWhere(timezones, {id:timezone}).value;

    next();
  });

  router.param('date', function(req, res, next, date){
    console.log('Parsing parameter: date', date);
    var badParamMessage = INVALID_PARAM_MESSAGE.replace('{{param}}', 'date');

    if(!moment(date).isValid()){
      return res.status(400).json({message:badParamMessage});
    }

    req.date = moment(date).format('YYYY-MM-DDTHH:mm:ss'); // Strip tz info

    next();
  });

  router
    .get('/:date/:sm/:em/:timezone', function(req, res, next){
      var dt = moment.tz(req.date, req.timezone);
      var isInWorkHours = isBusinessHours(dt, req.timezone, req.startTimeInMinutes, req.endTimeInMinutes);
      return res.status(isInWorkHours ? 200 : 404).json({
        status:isInWorkHours,
        startDate: getStartLocalTime(dt, req.timezone, req.startTimeInMinutes).format(),
        evaluatedDate: dt.format(),
        endDate: getEndLocalTime(dt, req.timezone, req.endTimeInMinutes).format(),
        timezone: req.timezone
      });
    })
    .get('/:sm/:em/:timezone', function(req, res, next){
      var dt = moment.tz(req.timezone);
      var isInWorkHours = isBusinessHours(dt, req.timezone, req.startTimeInMinutes, req.endTimeInMinutes);
      return res.status(isInWorkHours ? 200 : 404).json({
        status:isInWorkHours,
        startDate: getStartLocalTime(dt, req.timezone, req.startTimeInMinutes).format(),
        evaluatedDate: dt.format(),
        endDate: getEndLocalTime(dt, req.timezone, req.endTimeInMinutes).format(),
        timezone: req.timezone
      });
    })
    .get('/:timezone', function(req, res, next){
      var dt = moment.tz(req.timezone);
      var isInWorkHours = isBusinessHours(dt, req.timezone, defaultStartTimeInMinutes, defaultEndTimeInMinutes);
      return res.status(isInWorkHours ? 200 : 404).json({
        status:isInWorkHours,
        startDate: getStartLocalTime(dt, req.timezone, defaultStartTimeInMinutes).format(),
        evaluatedDate: dt.format(),
        endDate: getEndLocalTime(dt, req.timezone, defaultEndTimeInMinutes).format(),
        timezone: req.timezone
      });
    })
    .get('/', function(req, res, next){
      var dt = moment.tz(defaultTimezone);
      var isInWorkHours = isBusinessHours(dt, defaultTimezone);
      return res.status(isInWorkHours ? 200 : 404).json({
        status:isInWorkHours,
        startDate: getStartLocalTime(dt, defaultTimezone, defaultStartTimeInMinutes).format(),
        evaluatedDate: dt.format(),
        endDate: getEndLocalTime(dt, defaultTimezone, defaultEndTimeInMinutes).format(),
        timezone: defaultTimezone
      });
    });

  function isBusinessHours(dt, timezone, startTimeInMinutes, endTimeInMinutes){
    startTimeInMinutes = startTimeInMinutes || defaultStartTimeInMinutes;
    endTimeInMinutes = endTimeInMinutes || defaultEndTimeInMinutes;

    if(dt.day() === 0 || dt.day() === 6){
      return false;
    }

    if(helper.isFederalHoliday(dt.toDate())){
      return false;
    }

    var startDate = getStartLocalTime(dt, timezone, startTimeInMinutes);
    var endDate = getEndLocalTime(dt, timezone, endTimeInMinutes);

    return dt.unix() >= startDate.unix() && dt.unix() <= endDate.unix();
  }

  function getStartLocalTime(dt, timezone, offsetMinutes){
    return moment.tz(dt.format('YYYY-MM-DD'), timezone).add(offsetMinutes, 'minutes');
  }

  function getEndLocalTime(dt, timezone, offsetMinutes){
    return moment.tz(dt.format('YYYY-MM-DD'), timezone).add(offsetMinutes, 'minutes').add(-1, 'seconds');
  }

  app.use('/is/businesshours', router);
};