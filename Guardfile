# A sample Guardfile
# More info at https://github.com/guard/guard#readme

guard 'jekyll' do
  watch /.*/
end

guard 'shell' do
  watch('i/js/builderapp.js')
  watch('i/js/modulizr.js') { `cd ./i/js/ && ./compress.sh` }
end
