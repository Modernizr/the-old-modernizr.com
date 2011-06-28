#/bin/sh
#uglifyjs --unsafe modulizr.js > builderapp.min.js
#echo ';' >> builderapp.min.js
#uglifyjs --unsafe underscore-min.js >> builderapp.min.js
#echo ';' >> builderapp.min.js


#uglifyjs --unsafe uglifyjs/lib/parse-js.js >> builderapp.min.js
#echo ';' >> builderapp.min.js
#uglifyjs --unsafe -nc uglifyjs/lib/process.js >> builderapp.min.js
#echo ';' >> builderapp.min.js
#cat uglifyjs/lib/process.js >> builderapp.min.js
#uglifyjs --unsafe uglifyjs/lib/squeeze-more.js >> builderapp.min.js
#echo ';' >> builderapp.min.js
#uglifyjs --unsafe uglifyjs/bin/uglifyjs.js >> builderapp.min.js
#echo ';' >> builderapp.min.js


cat modulizr.js > tmp.js
echo ';' >> tmp.js
cat underscore-min.js >> tmp.js
echo ';' >> tmp.js

cat uglifyjs/lib/parse-js.js >> tmp.js
echo ';' >> tmp.js
cat uglifyjs/lib/process.js >> tmp.js
echo ';' >> tmp.js
cat uglifyjs/lib/squeeze-more.js >> tmp.js
echo ';' >> tmp.js
cat uglifyjs/bin/uglifyjs.js >> tmp.js
echo ';' >> tmp.js

cat swfobject.js >> tmp.js
echo ';' >> tmp.js
cat downloadify.min.js >> tmp.js
echo ';' >> tmp.js
cat builderapp.js >> tmp.js
echo ';' >> tmp.js

uglifyjs --unsafe --ascii tmp.js > builderapp.min.js
#cat tmp.js > builderapp.min.js
rm -f tmp.js

m=$(ls -la builderapp.min.js | awk '{ print $5}')
gzip -nfc --best builderapp.min.js > builderapp.min.js.gz
g=$(ls -la builderapp.min.js.gz | awk '{ print $5}')
echo "$m bytes minified, $g bytes gzipped"
rm builderapp.min.js.gz
if [ "--test" == "$1" ]; then
  rm builderapp.min.js
fi

