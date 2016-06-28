'use strict';

angular.module('myApp.settings', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/settings', {
            templateUrl: 'settings/settings.html',
            controller: 'SettingsCtrl'
        });
    }])
    .service('cityWeatherService', function($http,$q) {
        //Here we have all the functions from openWeather api
        function setWeatherFunctions(openWeatherData) {
            this.data = openWeatherData;

            this.getTemp = function() {
                return this.data && this.data.main ? this.data.main.temp : null;
            };
            this.getWindSpeed = function() {
                return this.data && this.data.wind ? this.data.wind.speed : null;
            };
            this.getWeatherDescription = function() {
                return this.data && this.data.weather && this.data.weather[0] ? this.data.weather[0].description : null;
            };
            this.getMinTemp = function() {
                return this.data && this.data.main ? this.data.main.temp_min : null;
            };
            this.getMaxTemp = function() {
                return this.data && this.data.main ? this.data.main.temp_max : null;
            };

            this.getWeatherId = function() {
                return this.data && this.data.weather && this.data.weather[0] ? this.data.weather[0]['id'] : null;
            };
            this.getIconCode = function() {
                return this.data && this.data.weather && this.data.weather[0] ? this.data.weather[0]['icon'] : null;
            };
            this.getIcon = function() {
                return 'http://openweathermap.org/img/w/' + this.getIconCode() + '.png';
            }
        }

        this.asyncGreet = function(city) {
            var deferred = $q.defer();
            var uri = 'http://api.openweathermap.org/data/2.5/weather' + "?q=" + city + "&units=metric&APPID=20a04174cafbc0d0b153d0edf7631f5c&callback=JSON_CALLBACK";
            $http.jsonp(uri).
                success(function(response, status) {
                    deferred.resolve(new setWeatherFunctions(response));
                }).error(function (error, status) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }
    })
    .directive('weatherList', function(cityWeatherService, $compile) {
        return {
            restrict: 'AEC',
            controller: function(){
                //add a city
                this.loadCity = function($scope, city) {
                    if(city != ""){
                        $scope.city = city.replace(/ /g,""); //we delete all the whitespaces

                        cityWeatherService.asyncGreet($scope.city).then(function(data) { //get all data for a city

                            $scope.weather[$scope.city] = {
                                city: $scope.city,
                                weatherId: data.getWeatherId(),
                                temp: data.getTemp(),
                                weatherDescription: data.getWeatherDescription(),
                                minTemp: data.getMinTemp(),
                                maxTemp: data.getMaxTemp(),
                                windSpeed: data.getWindSpeed(),
                                dataFilled: true,
                            };

                        }, function() {alert('please insert a correct city')});
                    }
                };
                this.addCityInList = function($scope, city){
                    angular.element(document.getElementById('weather-list')).append($compile('<li>' +
                        '<span>'+city+'</span>' +
                        '<div class="delete-city" data-city="'+city+'" ng-click="deleteCity($event)"><img src="../resources/delete.svg" delete</div>' +
                        '</li>')($scope));
                };
            },
            link: function ($scope, element, attrs, weatherListController) {

                //we retrieve all the city selected if they exists
                if(Object.keys($scope.weather).length > 0){
                    for(var city in $scope.weather){
                        //If we have already all the data
                        if($scope.weather[city].dataFilled == true){
                            weatherListController.addCityInList($scope, city);
                        }
                    }
                }

                //When we validate the form
                $scope.addCity = function(){
                    if($scope.newCity != ""){

                        //Get the information for a city
                        weatherListController.loadCity($scope, $scope.newCity);

                        //Add th city in list
                        weatherListController.addCityInList($scope, $scope.newCity);

                        //Set input to empty
                        angular.element(document.getElementById('new-city')).val('');
                    }
                };

                //When we delete a city
                $scope.deleteCity = function($event){
                    if($event.target.getAttribute("city") != ""){

                        //remove the object occurences
                        delete($scope.weather[$event.target.parentNode.getAttribute("data-city")]);
                        $event.target.parentNode.parentNode.remove();
                    }
                };
            }
        };

    })
    .controller('SettingsCtrl', function($scope) {

    });