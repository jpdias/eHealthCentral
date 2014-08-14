app = require('../app');
var log = require('../libs/log')(module);


var config = require('../libs/config');
var databaseUrl = config.get('mongodb'); // "username:password@example.com/mydb"
log.info(databaseUrl);
var collections = ["patients","records"];
var db = require("mongojs").connect(databaseUrl, collections);

//Error handling !
app.use(function(req, res, next){
    res.status(404);
    log.error('Not found URL: %s',req.url);
    res.send({ error: 'Not found' });
    return;
});

app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
    return;
});
//End of it.

//POST patient
app.post('/api/patient', function(req,res){
  var date = new Date();
  log.info("POST Patient: " + date);
  db.patients.save(req.body, function(err, saved) {
    if( err || !saved ) log.error("\nError: Not saved\n");
    else log.info("Saved");
  });
  res.send(200);
});

//UPDATE Patient
/*app.post("/api/diagn", function(req,res){
   log.info("UPDATE Patient + " + JSON.stringify(req.body));
   db.patients.update({processo:req.body.processo}, {$addToSet:{diagnosticos:req.body.diagnosticos}}, function(err, saved) {
     if( err || !saved ) log.error("Error: Not saved\n");
     else log.info("Saved");
   });
   res.send(200);
});*/

app.post("/api/ancest", function(req,res){
   var date = new Date();
   log.info("UPDATE Patient" + date);
   db.patients.update({processo:req.body.processo}, {$addToSet:{antecedentes:req.body.antecedentes}},function(err, saved) {
     if( err || !saved ) log.error("Error: Not saved\n");
     else log.info("Saved");
   });
   res.send(200);
})

//GET Patient
app.get('/api/patient', function(req,res){
  log.info("GET patient");
  db.patients.find(req.body, function(err, result) {
    if( err || !result ) log.error("\nError\n");
    else{
      log.error("Done.");
      res.send(result);
    }
  });
});

app.post('/api/testes', function(req,res){
  log.info("GET patient");
db.patients.find({antecedentes:{ $elemMatch: {descricao:req.body.doenca}}}, function(err, result) {
    if( err || !result ) log.error("\nError\n");
    else{
      log.info("Done.");
      log.debug(result[0]);
      res.send(result[0].nome);
    }
  });
});


app.post('/api/record', function(req,res){
  var date = new Date();
  log.info("POST Record: " + date);
  db.records.save(req.body, function(err, saved) {
    if( err || !saved ) log.error("\nError: Not saved\n");
    else log.info("Saved");
  });
  res.send(200);
});
//add exame
app.post("/api/exame", function(req,res){
   log.info("UPDATE Patient + " + JSON.stringify(req.body));
   db.patients.update({numsequencial:req.body.numsequencial,episodio:req.body.episodio,modulo:req.body.modulo}, {$addToSet:{exames:req.body.exames}},function(err, saved) {
     if( err || !saved ) log.error("Error: Not saved\n");
     else log.info("Saved");
   });
   res.send(200);
});
//add analise
app.post("/api/analise", function(req,res){
   log.info("UPDATE Patient + " + JSON.stringify(req.body));
   db.patients.update({numsequencial:req.body.numsequencial,episodio:req.body.episodio,modulo:req.body.modulo}, {$addToSet:{analises:req.body.analises}},function(err, saved) {
     if( err || !saved ) log.error("Error: Not saved\n");
     else log.info("Saved");
   });
   res.send(200);
});

app.get('/api/record', function(req,res){
  log.info("GET Patient");
  if(!req.body){
    db.records.find(req.body, function(err, result) {
      if( err || !result ) log.error("\nError\n");
      else{
        log.error("Done.");
        res.send(result);
      }
    });
  }
  else{
    res.send({ error: 'Not found' })
  }
});

require("./xml");
require("./views");
