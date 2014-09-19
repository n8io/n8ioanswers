module.exports = function(app){
  var router = express.Router();

  router
    .get('/', function(req, res, next){
      var dt = moment(req.param('date')).isValid() ? moment(req.param('date')) : moment();
      var isInWorkHours = isBusinessHours(dt);
      return res.status(isInWorkHours ? 200 : 404).json({
        status:isInWorkHours,
        evaluatedDate: dt.format()
      });
    });

  function isBusinessHours(dt){
    dt = dt.tz('America/New_York');
    if(dt.day() === 0 || dt.day() === 6){
      return false;
    }

    if(helper.isFederalHoliday(dt.toDate())){
      return false;
    }

    var startDate = moment(dt.format('MM/DD/YYYY') + ' 08:00:00').tz('America/New_York');
    var endDate = moment(dt.format('MM/DD/YYYY') + ' 16:59:59').tz('America/New_York');

    return dt >= startDate && dt <= endDate;
  }

  app.use('/is/businesshours', router);
};