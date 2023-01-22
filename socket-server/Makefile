all: generate run
install:
	cd ..
	npm install -g @angular/cli
	npm install
	cd socketserver
	npm install
	
tsc:
	tsc

buildng:
	cd ..
	ng build --output-path ./public
	cd socket-server
watchng:
	ng build --watch --output-path ./socket-server/public &
run:
	node app.js

watch: watchng tsc run

generate: buildng tsc

