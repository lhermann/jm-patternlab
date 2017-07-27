# gem install sass --no-user-install
sass --sourcemap=none source/_scss/main.scss source/_scss/main.css
# npm install --global postcss-cli autoprefixer
postcss source/_scss/*.css -u autoprefixer -d source/css/ --no-map
# see: https://getcomposer.org/download/
# mv composer.phar /usr/local/bin/composer
composer install
php core/console --generate

