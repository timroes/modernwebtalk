var app = angular.module('talk', ['LocalStorageModule']);

app.run(function($window) {

});

app.directive('browserSupport', function() {
	return {
		restrict: 'E',
		scope: {
			'chrome': '@',
			'ff': '@',
			'ie': '@',
			'safari': '@',
			'iepre': '=',
			'ffpre': '=',
			'safaripre': '=',
			'chromepre': '=',
			'ffpart': '=',
			'iepart': '=',
			'chromepart': '=',
			'safaripart': '='
		},
		replace: true,
		templateUrl: '/views/browserSupport.html',
		link: function(scope) {

		}
	};
});

app.directive('onShow', function() {
	return {
		restrict: 'A',
		scope: {
			'onShow': '&'
		},
		link: function(scope, elem) {
			var callback = function(ev) {
				if(ev.currentSlide == elem[0]) {
					scope.$apply(function() {
						scope.onShow();
					});
				}
			};

			Reveal.addEventListener('slidechanged', callback);

			scope.$on('$destroy', function() {
				Reveal.removeEventListener('slidechanged', callback);
			});
		}
	};
});

app.controller('MainController', function($scope) {

	$scope.fullscreen = function() {
		document.documentElement.webkitRequestFullscreen();
	};

	$scope.showIframes = false;

	$scope.startBrowserquestVideo = function() {
		var video = document.getElementById('browserquest_video');
		video.currentTime = 0;
		video.play();
	};

	Reveal.addEventListener('slidechanged', function(ev) {
		if (ev.currentSlide.id === "preloadIframes") {
			$scope.$apply(function() {
				$scope.showIframes = true;
			});
		}
	});

});

app.controller('ServiceWorkerController', function($scope, $http, localStorageService) {

	var lsKey = "modernweb.swcode." + new Date().toLocaleDateString();

	$scope.code = localStorageService.get(lsKey);

	$scope.register = function() {
		localStorageService.set(lsKey, $scope.code);
		$http.post('/sw/store', { code: $scope.code })
		.then(function() {
			navigator.serviceWorker.register('/serviceWorker.js')
			.then(function(reg) {
				console.log("registered: %o", reg);
				console.log(reg.active);
			}, function(err) {
				console.error("Error registring Service Worker");
				console.error(err);
			});
		});
	};

	$scope.$watch('code', function(code) {
		localStorageService.set(lsKey, $scope.code);
		$http.post('/sw/store', { code: code });
	});

	$scope.url = "http://api.randomuser.me/";

	$scope.fetch = function() {
		$http.get($scope.url)
		.then(function(response) {
			$scope.fetchedData = response.data;
		});
	};
});

app.controller('ExecuteController', function($scope) {

	$scope.execute = function() {
		eval($scope.source);
	};

});

app.controller('WebAudioController', function($scope, $http) {
	
	var ctx = new AudioContext();

	$scope.execute = function() {
		eval($scope.source);
	};

});

app.controller('SpeechSynthesisController', function($scope) {

	$scope.source = "var u = new SpeechSynthesisUtterance();\nu.text = 'Hello World';\n\nspeechSynthesis.speak(u);";

	$scope.execute = function() {
		eval($scope.source);
	};
});