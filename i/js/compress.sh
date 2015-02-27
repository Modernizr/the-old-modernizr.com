#/bin/sh

echo "Compressing the JS into builderapp.min.js..."

echo "" > builderapp.min.js

cat license.js > builderapp.min.js

# https://github.com/mishoo/UglifyJS2
# npm install uglify-js -g

uglifyjs --source-map builderapp.map.js --source-map-include-sources \
  modulizr.js underscore-min.js \
  uglifyjs/lib/parse-js.js uglifyjs/lib/process.js uglifyjs/lib/squeeze-more.js uglifyjs/bin/uglifyjs.js \
  builderapp.js \
  >> builderapp.min.js


uglifyjs --source-map jquery-1.11.2.min.map.js --source-map-include-sources \
  jquery-1.11.2.js > jquery-1.11.2.min.js


gzip -c builderapp.min.js > builderapp.min.js.gz
m=$(ls -la builderapp.min.js | awk '{ print $5}')
g=$(ls -la builderapp.min.js.gz | awk '{ print $5}')

echo "$m bytes minified"
echo "$g bytes gzipped"
rm builderapp.min.js.gz


if [ "--test" == "$1" ]; then
  rm builderapp.min.js
fi

