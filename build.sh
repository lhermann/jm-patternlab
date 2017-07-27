sass --sourcemap=none source/_scss/main.scss source/_scss/main.css 
postcss source/_scss/*.css -u autoprefixer -d source/css/ --no-map
php core/console --generate

