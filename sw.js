var code = "";

self.addEventListener('fetch', function(event) {
	console.log("Do we need to serve a dynamic Service worker code?");
	if (event.request.url.match(/\/serviceWorker.js$/)) {
		console.log('requested serviceWorker.js');
		event.respondWith(new Response(code, {
			headers: { 'Content-Type': 'application/javascript' }
		}));
	}
});

self.addEventListener('message', function(event) {
	code = event.data.code;
});