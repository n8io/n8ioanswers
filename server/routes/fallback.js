module.exports = function(app){
  var endpoints = require('../data/endpoints.json');
  var router = express.Router();

  router
    .get('*', function(req, res, next){
      return res.status(404).json({message:'Resource not found.'});
    });

  app.use('/', router);
};