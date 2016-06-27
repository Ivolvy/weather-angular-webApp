'use strict';

angular.module('myApp.home', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'home/home.html',
            controller: 'HomeCtrl'
        });
    }])

    .service('cityWeatherService', function($http,$q) {
        function setWeatherFunctions(openWeatherData) {
            this.data = openWeatherData;

            this.getTemp = function() {
                return this.data && this.data.main ? this.data.main.temp : null;
            };
            this.getWindSpeed = function() {
                return this.data && this.data.wind ? this.data.wind.speed : null;
            };
            this.getWeatherDescription = function() {
                return this.data && this.data.weather ? this.data.weather[0].description : null;
            };
            this.getMinTemp = function() {
                return this.data && this.data.main ? this.data.main.temp_min : null;
            };
            this.getMaxTemp = function() {
                return this.data && this.data.main ? this.data.main.temp_max : null;
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
    .directive('cityWeather', function(cityWeatherService, $compile) {
        return {
            restrict: 'AEC',
            controller: function(){
                this.loadTemplate = function($scope, city){
                    angular.element(document.getElementById('container')).append($compile("" +
                        '<div id="'+city+'" class="city-name" ng-model="'+city+'">' +
                        '<h1 class="title">'+$scope.weather[city].city+'<img src="'+$scope.weather[city].icon+'"/></h1>' +
                        '<h3 class="tempW">'+$scope.weather[city].temp+'&deg;C</h3>' +
                        '<h3 class="wDescription">'+$scope.weather[city].weatherDescription+'</h3>' +
                        '<h4 class="minAndMax">Min: '+$scope.weather[city].minTemp+'&deg;C, Max: '+$scope.weather[city].maxTemp+'&deg;C</h4>' +
                        '<h4 class="windSpeed">Wind speed: '+$scope.weather[city].windSpeed+'</h4>' +
                        '</div>')($scope));
                }
            },
            link: function ($scope, element, attrs, cityWeatherController) {

                //we retrieve all the city selected if they exists
                if(Object.keys($scope.weather).length > 0){
                    for(var city in $scope.weather){
                        cityWeatherController.loadTemplate($scope, city);
                    }
                }

                //add a city
                $scope.addCity = function() {
                    if($scope.newCity != ""){
                        $scope.city = $scope.newCity.replace(/ /g,""); //we delete all the whitespaces

                        cityWeatherService.asyncGreet($scope.city).then(function(data) { //get all data for a city

                            $scope.weather[$scope.city] = {
                                city: $scope.city,
                                icon: data.getIcon(),
                                temp: data.getTemp(),
                                weatherDescription: data.getWeatherDescription(),
                                minTemp: data.getMinTemp(),
                                maxTemp: data.getMaxTemp(),
                                windSpeed: data.getWindSpeed(),
                            };

                            cityWeatherController.loadTemplate($scope, $scope.city);

                        }, function() {alert('please insert a correct city')});
                    }
                };
            }
        };

    })

    .controller('HomeCtrl', function($scope, cityWeatherService) {
    });
