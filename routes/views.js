var log = require('../libs/log')(module);
var databaseUrl = 'localhost/cda'; // "username:password@example.com/mydb"
log.info(databaseUrl);
var collections = ["patients","records"];
var db = require("mongojs").connect(databaseUrl, collections);

app.get('/', function(req,res){
  db.patients.find({},{processo:1,_id:0}, function(err, result) {
    var list ={patients: new Array()};
    if( err || !result ) log.error("\nError\n");
    else{
      var i =0;
      while(result[i]!=null){
          list.patients.push({number: result[i].processo});
          i++;
      }
      res.render('index',list);
    }

  });
});
var dados;

app.get('/timeline', function(req,res){

  log.info("GET Timeline : " + req.query.processo);
  db.patients.find({processo:parseInt(req.query.processo)}, function(err, result) {
    if( err || !result ) log.error("Error");
    else{
      var sex;
      if(result[0].sexo =="F")
        sex = "Feminino";
      else
        sex = "Masculino";
      dados = {nome:result[0].nome,
      processo:result[0].processo,
      sexo:sex,
      datanasc:result[0].datanascimento,
      diagnosticos:new Array(),
      consultas: new Array(),
      internamentos: new Array(),
      urgencia: new Array(),
      hospitaldia: new Array(),
      bloco: new Array(),
      exames: new Array(),
      analises: new Array()};
    }
  });
   db.records.find({processo:parseInt(req.query.processo)}, function(err, result) {
      if( err || !result ) log.error("\nError\n");
      else{
      var i=0;
        while(result[i]!=null){

          //separar por tipo de evento
          if(result[i].modulo=="CON")
            dados.consultas.push(result[i]);
          else if(result[i].modulo=="INT")
            dados.internamentos.push(result[i]);
          else if(result[i].modulo=="URG")
            dados.urgencia.push(result[i]);
          else if(result[i].modulo=="HDI")
            dados.hospitaldia.push(result[i]);
          else if(result[i].modulo=="BLO")
            dados.bloco.push(result[i]);

          //separar por tipo de documento
          if(result[i].exames != null )
            dados.exames = dados.exames.concat(result[i].exames);
          if(result[i].analises != null )
            dados.analises = dados.analises.concat(result[i].analises);
          if(result[i].diagnosticos != null )
            dados.diagnosticos = dados.diagnosticos.concat(result[i].diagnosticos);
          i++;
        }
      }
      res.render('timeline/index',dados);
    });


});
