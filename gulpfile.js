const { src, dest, watch, parallel } = require('gulp');

// CSS
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

// Imágenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// Javascript
const terser = require('gulp-terser-js');

// Función de compilado de CSS
function css( done ) {
    
    console.log('Compilando SASS...');

    src('src/scss/**/*.scss') // Identificar los archivos scss a compilar
        .pipe(sourcemaps.init())
        .pipe( plumber())
        .pipe( sass() ) // Compilarlo
        .pipe( postcss([ autoprefixer(), cssnano() ]))
        .pipe( sourcemaps.write('.'))
        .pipe( dest('build/css') ) // Almacenarla en el disco duro
    

    done();
}

// Función de procesado de imágenes
function imagenes(done){
    const opciones = {
        optimizationLevel: 3
    }

    src('src/img/**/*.{png,jpg}')
        .pipe( cache( imagemin(opciones) ) )
        .pipe( dest('build/img') )

    done();
}

// Creación de versiones WebP
function versionWebp( done ) {

    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}') // Añadir extensiones a procesar
        .pipe( webp( opciones ) )
        .pipe( dest('build/img') )


    done();
}

// Creación de versiones Avif 
// - Formato que aun no tiene suficiente soporte: https://caniuse.com/?search=avif
function versionAvif( done ) {

    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
        .pipe( avif( opciones ) )
        .pipe( dest('build/img') )


    done();
}

// Compilado y minificado de JS
function javascript( done ) {
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe( terser() )
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));

    done();
}

// Watch de cambios
function dev( done ) {
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);
    done();
}

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel( imagenes, versionWebp, versionAvif, javascript, dev );