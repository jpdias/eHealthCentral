var builder = require('xmlbuilder');

app.get('/api/xml',function(req,res){
    var xml = builder.create('root')
    .ele('xmlbuilder', {'for': 'node-js'})
      .ele('repo', {'type': 'git'}, 'hey')
    .end({ pretty: true});
  res.header('Content-Type','text/xml').send(xml);
});
