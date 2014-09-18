module.exports = function(app){
  var router = express.Router();

  router
    .get('/endpoints', function(req, res, next){
      return res.json([
        {
          route: '/is/leapYear?year='+(new Date()).getFullYear(),
          params: [
            {
              name: 'year',
              required: false,
              type: 'query',
              desc: 'The calendar year you want to check if it is a leap year. If not provided, it evaluates the current year.'
            }
          ]
        },
        {
          route: '/is/month/:monthOfYear',
          params: [
            {
              name: 'monthOfYear',
              required: true,
              type: 'route',
              desc: 'The calendar month you want to check if it is currently. E.g., January, February, Jan, Feb.'
            }
          ]
        },
        {
          route: '/is/today/:dayOfWeek',
          params: [
            {
              name: 'dayOfWeek',
              required: true,
              type: 'route',
              desc: 'The day of week. E.g., Monday, Tuesday, Mon, Tue.'
            }
          ]
        },
        {
          route: '/is/usHoliday?date='+moment().format('M/DD/YYYY'),
          params: [
            {
              name: 'date',
              required: false,
              type: 'query',
              desc: 'The date in which you want to check if it is a US Holiday. If not provided, it evaluates the current day.'
            }
          ]
        },
        {
          route: '/is/weather/raining/:latLong/:apiKey',
          params: [
            {
              name: 'latLong',
              required: true,
              type: 'route',
              desc: 'The latitude and longitude of the geographic location you want to know whether or not it is raining. Must be comma separated. E.g., 41.0842, -81.5141'
            },
            {
              name: 'apiKey',
              required: true,
              type: 'route',
              desc: 'Your forecast.io api key'
            }
          ]
        },
        {
          route: '/is/weather/raining/soon/:latLong/:apiKey',
          params: [
            {
              name: 'latLong',
              required: true,
              type: 'route',
              desc: 'The latitude and longitude of the geographic location you want to know whether or not it is raining. Must be comma separated. E.g., 41.0842, -81.5141'
            },
            {
              name: 'apiKey',
              required: true,
              type: 'route',
              desc: 'Your forecast.io api key'
            }
          ]
        },
        {
          route: '/is/weather/raining/:intesity/:latLong/:apiKey',
          params: [
            {
              name: 'intensity',
              required: true,
              type: 'route',
              desc: 'The intensity of rain you want to know if it is raining at currently. Valid values are: light, moderate, heavy.'
            },
            {
              name: 'latLong',
              required: true,
              type: 'route',
              desc: 'The latitude and longitude of the geographic location you want to know whether or not it is raining. Must be comma separated. E.g., 41.0842, -81.5141'
            },
            {
              name: 'apiKey',
              required: true,
              type: 'route',
              desc: 'Your forecast.io api key'
            }
          ]
        }
      ]);
    })
    .get('*', function(req, res, next){
      return res.status(404).json({message:'Resource not found.'});
    });

  app.use('/', router);
};