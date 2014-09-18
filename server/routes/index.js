 module.exports = function(app){
  require('./dayOfWeek')(app);
  require('./monthOfYear')(app);
  require('./leapYear')(app);
  require('./usHoliday')(app);
  require('./weather')(app);

  require('./fallback')(app);
};