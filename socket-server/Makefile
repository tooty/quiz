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
	ng build --output-path ./socket-server/public/
watchng:
	ng build --watch --output-path ./socket-server/public &
run:
	node app.js

watch: watchng tsc run

generate: buildng tsc

