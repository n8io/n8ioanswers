module.exports = function(app){
  var router = express.Router();

  router
    .get('/', function(req, res, next){
      var dt = moment(req.param('date')).isValid() ? moment(req.param('date')) : moment().tz('America/New_York');
      var isInWorkHours = isBusinessHours(dt);
      return res.status(isInWorkHours ? 200 : 404).json({
        status:isInWorkHours,
        evaluatedDate: dt.format()
      });
    });

  function isBusinessHours(dt){
    if(dt.day() === 0 || dt.day() === 6){
      return false;
    }

    if(helper.isFederalHoliday(dt.toDate())){
      return false;
    }

    var startDate = moment.tz(dt.format('MM/DD/YYYY') + ' 08:00:00', 'America/New_York');
    var endDate = moment.tz(dt.format('MM/DD/YYYY') + ' 16:59:59', 'America/New_York');

    console.log('startDate', startDate.format());
    console.log('dt', dt.format());
    console.log('endDate', endDate.format());

    return dt.unix() >= startDate.unix() && dt.unix() <= endDate.unix();
  }

  app.use('/is/businesshours', router);
};