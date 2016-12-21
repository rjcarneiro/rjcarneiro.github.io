(function () {

    "use strict";

    /**
     * Twenty Minute Rule Web App
     * @author Ricardo Carneiro <me@ricardocarneiro.pt>
     */
    var app = angular.module('twentyMinuteRuleApp', ['ngRoute', 'timer', 'ui.bootstrap']);

    /**
     * Configure the Routes
     */
    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            // Home
            .when("/", { templateUrl: "partials/home.html", controller: "HomeController" })
            // Pages
            .otherwise("/", { templateUrl: "partials/home.html", controller: "HomeController" });
    }]);

    /**
    * Constants
    */
    app.constant("CONSTANTS", {
        "TAG": "twentyMinuteRuleNotificationTag",
        "COUNTDOWN": 1200
    });

    /**
     * Controls all other Pages
     */
    app.controller('HomeController', function ($scope, CONSTANTS, $uibModal) {

        var audio = null;
        var modalInstance = null;
        var circle = null;
        var notification = null;

        $scope.areNotificationSupported = true;
        $scope.areNotificationEnabled = false;
        $scope.lastNotification = null;
        // $scope.countdown = CONSTANTS.COUNTDOWN;
        $scope.countdown = 10;

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

        var playSound = function () {
            if (audio) {
                audio.load();
                audio.play();
            }
        };

        var stopSound = function () {
            if (audio) {
                audio.pause();
            }
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

            notification = new Notification("Rest your eyes for 20 seconds...", options);

            playSound();

            var automaticTimeout = setTimeout(function () {
                restart();
            }, 20 * 1000);

            notification.onclick = function (event) {
                event.preventDefault();

                if (automaticTimeout) {
                    clearTimeout(automaticTimeout);
                }

                notification.close();
                restart();
            };

            showModal();

        };

        var showModal = function () {
            modalInstance = $uibModal.open({
                templateUrl: 'partials/modal.html',
                windowTemplateUrl: 'partials/window.html',
                keyboard: false,
                scope: $scope
            });
        };

        var restart = function () {

            if (notification) {
                notification.close();
            }

            if (modalInstance) {
                modalInstance.close();
            }

            stopSound();

            if (circle) {
                circle.stop();
                circle.set(0);
            }

            if (modalInstance) {

            }
            $scope.$broadcast('timer-reset');
            $scope.$broadcast('timer-start');
        };

        $scope.$on('timer-tick', function (event, args) {
            if (circle) {
                circle.animate(1 - args.millis / ($scope.countdown * 1000));
            }
        });

        $scope.init = function () {

            audio = new Audio("audio/harp.mp3");

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

            circle = new ProgressBar.SemiCircle('#loaderContainer', {
                strokeWidth: 6,
                color: '#FFEA82',
                trailColor: '#eee',
                trailWidth: 1,
                easing: 'easeInOut',
                duration: 1400,
                svgStyle: null,
                text: {
                    value: '',
                    alignToBottom: false
                },
                from: { color: '#FFEA82' },
                to: { color: '#ED6A5A' },
                // Set default step function for all animate calls
                step: (state, bar) => {
                    bar.path.setAttribute('stroke', state.color);
                    var value = Math.round(bar.value() * 100);
                    if (value === 0) {
                        bar.setText('');
                    } else {
                        bar.setText(value + '%');
                    }

                    bar.text.style.color = state.color;
                }
            });

            circle.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
            circle.text.style.fontSize = '2rem';

        };

    });

})();