var app = angular.module('talk', []);

app.run(function() {
	navigator.serviceWorker.register('/sw.js')
	.catch(function(error) {
		window.alert('Could not register Service Worker.');
	});
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

});

app.controller('ServiceWorkerController', function($scope, $http) {

	$scope.$watch('code', function(code) {
		console.log("code changed");
		if (code && navigator.serviceWorker.controller) {
			navigator.serviceWorker.controller.postMessage({ code: code });
		}
	});

	$scope.register = function() {
		console.log("ServiceWorker");
		navigator.serviceWorker.register('data:application/javascript;base64,Y29uc29sZS5sb2coImhlbGxvIFdvcmxkIik7')
		.then(function(reg) {
			console.log('registered service worker');
			location.reload();
		})
		.catch(function(reason) {
			console.log('ServiceWorker registration failed', reason);
		});
	};

	$scope.fetch = function() {
		$http.get($scope.url)
		.then(function(response) {
			console.log(response.data);
		});
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