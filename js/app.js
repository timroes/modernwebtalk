var app = angular.module('talk', []);

app.run(function() {
	navigator.serviceWorker.register('/sw.js')
	.catch(function(error) {
		window.alert('Could not register Service Worker.');
	});
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

	$scope.loadWebGl = function() {
		container = document.getElementById( 'webgl' );

				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );
				camera.position.y = getY( worldHalfWidth, worldHalfDepth ) * 100 + 100;

				controls = new THREE.FirstPersonControls( camera );

				controls.movementSpeed = 1000;
				controls.lookSpeed = 0.125;
				controls.lookVertical = true;

				scene = new THREE.Scene();

				// sides

				var matrix = new THREE.Matrix4();

				var pxGeometry = new THREE.PlaneTypedGeometry( 100, 100 );
				pxGeometry.uvs[ 1 ] = 0.5;
				pxGeometry.uvs[ 3 ] = 0.5;
				pxGeometry.applyMatrix( matrix.makeRotationY( Math.PI / 2 ) );
				pxGeometry.applyMatrix( matrix.makeTranslation( 50, 0, 0 ) );

				var nxGeometry = new THREE.PlaneTypedGeometry( 100, 100 );
				nxGeometry.uvs[ 1 ] = 0.5;
				nxGeometry.uvs[ 3 ] = 0.5;
				nxGeometry.applyMatrix( matrix.makeRotationY( - Math.PI / 2 ) );
				nxGeometry.applyMatrix( matrix.makeTranslation( - 50, 0, 0 ) );

				var pyGeometry = new THREE.PlaneTypedGeometry( 100, 100 );
				pyGeometry.uvs[ 5 ] = 0.5;
				pyGeometry.uvs[ 7 ] = 0.5;
				pyGeometry.applyMatrix( matrix.makeRotationX( - Math.PI / 2 ) );
				pyGeometry.applyMatrix( matrix.makeTranslation( 0, 50, 0 ) );

				var pzGeometry = new THREE.PlaneTypedGeometry( 100, 100 );
				pzGeometry.uvs[ 1 ] = 0.5;
				pzGeometry.uvs[ 3 ] = 0.5;
				pzGeometry.applyMatrix( matrix.makeTranslation( 0, 0, 50 ) );

				var nzGeometry = new THREE.PlaneTypedGeometry( 100, 100 );
				nzGeometry.uvs[ 1 ] = 0.5;
				nzGeometry.uvs[ 3 ] = 0.5;
				nzGeometry.applyMatrix( matrix.makeRotationY( Math.PI ) );
				nzGeometry.applyMatrix( matrix.makeTranslation( 0, 0, -50 ) );

				//

				var geometry = new THREE.TypedGeometry( worldWidth * worldDepth * 2 * 5 ); // 2 triangles, 5 possible sides

				for ( var z = 0; z < worldDepth; z ++ ) {

					for ( var x = 0; x < worldWidth; x ++ ) {

						var h = getY( x, z );

						matrix.makeTranslation(
							x * 100 - worldHalfWidth * 100,
							h * 100,
							z * 100 - worldHalfDepth * 100
						);

						var px = getY( x + 1, z );
						var nx = getY( x - 1, z );
						var pz = getY( x, z + 1 );
						var nz = getY( x, z - 1 );

						geometry.merge( pyGeometry, matrix );

						if ( ( px != h && px != h + 1 ) || x == 0 ) {

							geometry.merge( pxGeometry, matrix );

						}

						if ( ( nx != h && nx != h + 1 ) || x == worldWidth - 1 ) {

							geometry.merge( nxGeometry, matrix );

						}

						if ( ( pz != h && pz != h + 1 ) || z == worldDepth - 1 ) {

							geometry.merge( pzGeometry, matrix );

						}

						if ( ( nz != h && nz != h + 1 ) || z == 0 ) {

							geometry.merge( nzGeometry, matrix );

						}

					}

				}

				geometry.computeBoundingSphere();

				var texture = THREE.ImageUtils.loadTexture( 'textures/minecraft/atlas.png' );
				texture.magFilter = THREE.NearestFilter;
				texture.minFilter = THREE.LinearMipMapLinearFilter;

				var mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { map: texture } ) );
				scene.add( mesh );

				var ambientLight = new THREE.AmbientLight( 0xcccccc );
				scene.add( ambientLight );

				var directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
				directionalLight.position.set( 1, 1, 0.5 ).normalize();
				scene.add( directionalLight );

				renderer = new THREE.WebGLRenderer();
				renderer.setClearColor( 0xbfd1e5 );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );

				container.innerHTML = "";

				container.appendChild( renderer.domElement );

				stats = new Stats();
				stats.domElement.style.position = 'absolute';
				stats.domElement.style.top = '0px';
				container.appendChild( stats.domElement );
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