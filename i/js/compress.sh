#/bin/sh

echo "Compressing the JS into builderapp.min.js..."


uglifyjs \
  modulizr.js underscore-min.js \
  uglifyjs/lib/parse-js.js uglifyjs/lib/process.js uglifyjs/lib/squeeze-more.js uglifyjs/bin/uglifyjs.js \
  builderapp.js \
  > builderapp.min.js

# /**
#  * Modulizr
#  * Modernizr Modular Build Tool
#  * Very simple tool for including or excluding tests
#  *
#  * @Author  Alex Sexton - AlexSexton@gmail.com
#  * @License Dual MIT and WTFPL
#  *//**
#  * This section does the conditional build
#  */

rm -f tmp.js

m=$(ls -la builderapp.min.js | awk '{ print $5}')
gzip -nfc --best builderapp.min.js > builderapp.min.js.gz
g=$(ls -la builderapp.min.js.gz | awk '{ print $5}')
echo "$m bytes minified, $g bytes gzipped"
rm builderapp.min.js.gz
if [ "--test" == "$1" ]; then
  rm builderapp.min.js
fi

