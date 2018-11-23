'use strict'
const Hapi = require('hapi');
const Wreck = require('wreck');
const city = require('./City');

const server = Hapi.server({
    port: 8080
});

server.route({
  method: 'GET',
  path: '/',
  handler: async (request) => {

      let city01 = request.query.city01;
      let city02 = request.query.city02;
      let message = null;
      let data = null;

      const url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22'
                  + city01 + '%22%20or%20text%3D%22' + city02 
                  + '%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
     
      try {
        const { res, payload } = await Wreck.get(url);
        if (payload.length > 0) {
          let payson = JSON.parse(payload);
          data = payson.query.results.channel;
          let city1 = new city.City(data[0].location.city, data[0].item.condition.temp);
          let city2 = new city.City(data[1].location.city, data[1].item.condition.temp);

          message = '<div style="padding: 25px; border: 2px solid black; text-align:justify; display: inline-block; font-size: 1.5em; box-shadow: 0px 0px 10px #000;">' 
                    + city1.toString() + '<br>' + city2.toString() + '<br>'
                    + 'Diferencia de temperatura: ' + city1.difference(city2) + '°C</div>';
        } 
       
      }
      catch(ex) {
        message = 'Parece que hay un error, por favor revisa la url. <br>' 
                  + 'Debería estar construida de esta forma: <a href="http://localhost:8080/?city01=Malaga&city02=London">http://localhost:8080/?city01=Malaga&city02=London</a>';
      }
        
      return message;
      
  }
});

const init = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
});

init();
