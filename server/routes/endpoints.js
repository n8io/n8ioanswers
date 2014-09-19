module.exports = function(app){
  var endpoints = require('../data/endpoints.json');
  var router = express.Router();

  router
    .get(['/endpoints'], function(req, res, next){
      return res.json(endpoints);
    })
    .get('/', function(req, res, next){
      return res.json(endpoints);
    })

  app.use('/', router);
};