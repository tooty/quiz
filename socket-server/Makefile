all: generate run

tsc:
	tsc

buildng:
	ng build --output-path ./public
watchng:
	ng build --watch --output-path ./socket-server/public &
run:
	node app.js

watch: watchng tsc run

generate: buildng tsc

