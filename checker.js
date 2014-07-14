var cv = require('opencv'),
    fs = require('fs'),
    request = require('request'),
    Twit = require('twit'),
    path = require('path'),
    async = require('async')

var T = new Twit({
    consumer_key: '...',
    consumer_secret: '...',
    access_token: '...',
    access_token_secret: '...'
});

var app = module.exports = {

    twitter_check: function(screen_name, done) {

        async.waterfall([
            function(done) {
                T.get('users/lookup', {
                    screen_name: screen_name
                }, done)
            },
            function(data, res, done) {
                var uri = data[0].profile_image_url.replace('_normal', '_bigger');
                request({uri: uri,encoding: null}, function(err, res, body) {
                    done(err, res, body, data[0])
                })
            },
            function(res, body, twitter_user, done) {
                app.check(body, function(err, is_person) {
                    done(err, is_person, twitter_user)
                })
            }
        ], function(err, is_person, twitter_user) {
            done(err, is_person, twitter_user)
        })

    },

    check: function(img, done) {

        cv.readImage(img, function(err, im) {
            im.detectObject(cv.FACE_CASCADE, {}, function(err, faces) {
                if (err) done(err)
                else done(null, faces.length > 0)
            });
        })

    }

}

// Test
if (require.main == module) {

    app.twitter_check('ksgsloan', function(err, res) {
        console.log(err || res)
    })
    
}