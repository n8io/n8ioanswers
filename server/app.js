require('./controllers/globals');

require('./routes')(app);

var server = app.listen(process.env.PORT || 3000, function(){
  console.log('Express server listening on port ' + server.address().port);
});