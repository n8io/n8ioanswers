module.exports = function(app){
  var router = express.Router();

  router.param('dayOfWeek', function(req, res, next, dayOfWeek){
    var badParamMessage = INVALID_PARAM_MESSAGE.replace('{{param}}', 'dayOfWeek');

    var dayAbbrs = _.map(moment.weekdays(), function(wd, i){
      return {
        id: wd.substring(0,3).toLowerCase(),
        index: i
      };
    });

    dayOfWeek = (dayOfWeek || '').toLowerCase();

    if(dayOfWeek.length < 3){
      return res.status(400).json({message:badParamMessage});
    }

    dayOfWeek = dayOfWeek.substring(0, 3);

    if(!_(dayAbbrs).some({id:dayOfWeek})){
      return res.status(400).json({message:badParamMessage});
    }

    req.dayOfWeek = _.findWhere(dayAbbrs, {id:dayOfWeek}).index;

    next();
  });

  router
    .get('/:dayOfWeek', function(req, res, next){
      var isTodayThisDayOfWeek = moment().day() === req.dayOfWeek;
      return res.status(isTodayThisDayOfWeek ? 200 : 404).json({status:isTodayThisDayOfWeek});
    });

  app.use('/is/today', router);
};