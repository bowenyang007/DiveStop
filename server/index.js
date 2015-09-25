var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

var pg = require('pg');
var connectionString = 'postgres://wzypzgrifbmmqn:J3vMBj5wK5nb-Z4dFjcfwqSXZL@ec2-54-243-149-147.compute-1.amazonaws.com:5432/d3dvhl55btercp';



pg.connect(connectionString, function(err, client, done) {
  if (err) {
    console.log('error fetching client from pool', err);
  }

  /* Check if table exists, if not create else do nothing */
  client.query('CREATE TABLE IF NOT EXISTS locations (' +
    '_id SERIAL, ' +
    'location VARCHAR(250), ' +
    'PRIMARY KEY (_id) ' +
    ')', function(err, result){
    if (err) {
      throw err;
    }
    done();
    }
  );

  client.query('CREATE TABLE IF NOT EXISTS aquatic_life (' +
    '_id SERIAL, ' +
    'type VARCHAR(100), ' +
    'PRIMARY KEY (_id) ' +
    ')', function(err, result){
    if (err) {
      throw err;
    }
    done();
    }
  );

  client.query('CREATE TABLE IF NOT EXISTS features (' +
    '_id SERIAL, ' +
    'feature VARCHAR(100), ' +
    'PRIMARY KEY(_id) ' +
    ')', function(err, result){
    if (err) {
      throw err;
    }
    done();
    }
  );


  client.query('CREATE TABLE IF NOT EXISTS sites (' +
    '_id SERIAL, ' +
    'site VARCHAR(250), ' +
    'location_id INT REFERENCES locations (_id), ' +
    'coordinates VARCHAR(150), ' +
    'max_depth INT, ' +
    'gradient VARCHAR(10), ' +
    'description VARCHAR, ' +
    'comments VARCHAR, ' +
    'PRIMARY KEY (_id) ' +
    ')', function(err, result){
    if (err) {
      throw err;
    }
    done();
    }
  );
    // 'FOREIGN KEY (location_id) REFERENCES locations (_id) ' +

  client.query('CREATE TABLE IF NOT EXISTS pictures (' +
    '_id SERIAL, ' +
    'site_id INT NOT NULL REFERENCES sites (_id), ' +
    'picture VARCHAR(250), ' +
    'PRIMARY KEY (_id) ' +
    ')', function(err, result){
    if (err) {
      throw err;
    }
    done();
    }
  );

  client.query('CREATE TABLE IF NOT EXISTS site_features (' +
    'site_id INT NOT NULL REFERENCES sites (_id), ' +
    'feature_id INT NOT NULL REFERENCES features (_id) ' +
    ')', function(err, result){
      done();
    }
  );

  client.query('CREATE TABLE IF NOT EXISTS site_aquatic_life (' +
    'site_id INT NOT NULL REFERENCES sites (_id), ' +
    'aquatic_life_id INT NOT NULL REFERENCES aquatic_life (_id) ' +
    ')', function(err, result){
      done();
    }
  );


});


app.get('/', function(req, res) {
  res.send(200, 'Hello world!');
});

app.get('/api/sites', function(req, res) {
 pg.connect(connectionString, function(error, client, done) {
  client.query('SELECT * FROM sites', function(err, result) {
    if (err) {
      throw err;
    }
    res.JSON(result);
  });
 });
});

app.listen(port, function() {
  console.log("Listening on port: " + port);
});