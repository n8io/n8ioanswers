module.exports = function(app){
  var router = express.Router();

  router
    .get('*', function(req, res, next){
      var isLY = isLeapYear(req.param('year'));
      return res.status(isLY ? 200 : 404).send(isLY ? 'yes' : 'no');
    });

  function isLeapYear(year){
    var year = parseInt(year, 0) || moment().year();
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
  }

  app.use('/is/leapyear', router);
};