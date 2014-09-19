module.exports = function(app){
  var router = express.Router();

  router
    .get('/', function(req, res, next){
      var isHoliday = helper.isFederalHoliday(req.param('date'));
      return res.status(isHoliday ? 200 : 404).json({status:isHoliday});
    });

  app.use('/is/usholiday', router);
};