var chalk = require('chalk');
var Table = require('cli-table');
var http = require('http');
var apiKey = "3440651caa125cbeadb81c6c196ff73a";

var args = process.argv;
module.exports = function(city) {
	var print = function(text) {
		console.log(chalk.green(text));
	};

	var error = function(json) {
		print(chalk.red(json.message));
	};

	var celsius = function(t) {
		return (t-273.15).toFixed(1);
	};

	var fahrenheit = function(t){
		return ((t - 273.15)* 1.8000 + 32.00).toFixed(1);
	};

	var formatTime = function(t) {
		var time = new Date(t * 1000);
		return time.getDate() + "-" + (time.getMonth() + 1) + " " + time.getHours() + ":" + time.getMinutes();
	};

	var output = function(json) {
		var table_head = new Table({
		  	colWidths: [81]
		});

		var title = ' ' + json.city.name + ',' + json.city.country;
		var lon_lat = '  lon:' + json.city.coord.lon.toFixed(2) + ' lat:' + json.city.coord.lat.toFixed(2);

		var text = chalk.blue(title + lon_lat);

		table_head.push(
		    ["location " + text]
		);

		var table_detail = new Table({
		  	colWidths: [20, 60]
		});

		var weather = json.list[0];

		table_detail.push(
			['Date Time', formatTime(weather.dt)],
		    ['Temprature', celsius(weather.main.temp) + '°C / ' + fahrenheit(weather.main.temp) + 'ºF'],
		    ['Humidity', weather.main.humidity + "%"],
		    ['Windspeed', weather.wind.speed + 'm/s']
		);

		console.log(table_head.toString());
		console.log(table_detail.toString());
	};

	var getJson = function() {
		var url = 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey;
		var request = http.get(url, function(res) {
			var body = '';
			res.on('data', function(data) {
				body = body + data;
			});
			res.on('end', function() {
				var json = JSON.parse(body);
				if(json.cod === 404) {
					error(json);
				} else {
					output(json);
				}
			});

		});
	};

	getJson();
};

