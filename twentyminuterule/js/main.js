(function () {

    "use strict";

    /**
     * Twenty Minute Rule Web App
     * @author Ricardo Carneiro <me@ricardocarneiro.pt>
     */
    var app = angular.module('twentyMinuteRuleApp', ['ngRoute', 'timer']);

    /**
     * Configure the Routes
     */
    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            // Home
            .when("/", { templateUrl: "partials/home.html", controller: "HomeController" })
            // Pages
            // .when("/about", { templateUrl: "partials/about.html", controller: "HomeController" })
            .otherwise("/", { templateUrl: "partials/home.html", controller: "HomeController" });
    }]);

    /**
    * Constants
    */
    app.constant("CONSTANTS", {
        "TAG": "twentyMinuteRuleNotificationTag"
    });

    /**
     * Controls all other Pages
     */
    app.controller('HomeController', function ($scope, CONSTANTS) {

        $scope.areNotificationSupported = true;
        $scope.areNotificationEnabled = false;
        $scope.lastNotification = null;
        $scope.countdown = 20 * 60;

        var clock = null;

        var isEnabled = function (permission) {
            return permission === "granted";
        };

        var addMinutes = function (date, minutes) {
            return new Date(date.getTime() + minutes * 60000);
        };

        $scope.finished = function () {
            showNotification();
        };

        var showNotification = function () {
            var now = new Date();
            $scope.lastNotification = now;

            var options = {
                body: 'Look for something 20 meters away for 20 seconds',
                icon: 'img/gnome-eyes-applet.png',
                requireInteraction: true,
                sound: 'audio/harp.mp3',
                tag: CONSTANTS.TAG,
                timestamp: Math.floor(now.getTime()),
                noscreen: true,
                vibrate: [200, 100, 200],
            };

            var notification = new Notification("Rest your eyes for 20 seconds...", options);

            notification.onclick = function (event) {
                event.preventDefault();
                notification.close();
                restart();
            };

        };

        var restart = function () {
            $scope.$broadcast('timer-reset');
            $scope.$broadcast('timer-start');
        };

        $scope.init = function () {

            if (!("Notification" in window)) {
                $scope.areNotificationSupported = false;
            } else {
                $scope.areNotificationEnabled = isEnabled(Notification.permission);

                if (!$scope.areNotificationEnabled) {
                    Notification.requestPermission(function (permission) {
                        $scope.areNotificationEnabled = isEnabled(permission);
                    });
                }
            }
        };

    });

})();