module.exports = function(app){
  var router = express.Router();

  router.param('monthOfYear', function(req, res, next, monthOfYear){
    var badParamMessage = INVALID_PARAM_MESSAGE.replace('{{param}}', 'monthOfYear');

    var monthAbbrs = _.map(moment.months(), function(month, i){
      return {
        id: month.substring(0,3).toLowerCase(),
        index: i
      };
    });

    monthOfYear = (monthOfYear || '').toLowerCase();

    if(monthOfYear.length < 3){
      return res.status(400).json({message:badParamMessage});
    }

    monthOfYear = monthOfYear.substring(0, 3);

    if(!_(monthAbbrs).some({id:monthOfYear})){
      return res.status(400).json({message:badParamMessage});
    }

    req.monthOfYear = _.findWhere(monthAbbrs, {id:monthOfYear}).index;

    next();
  });

  router
    .get('/:monthOfYear', function(req, res, next){
      var isMonthThisMonthOfYear = moment().month() === req.monthOfYear;
      return res.status(isMonthThisMonthOfYear ? 200 : 404).json({status:isMonthThisMonthOfYear});
    });

  app.use('/is/month', router);
};