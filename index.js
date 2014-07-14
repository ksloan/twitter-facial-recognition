var express = require('express'),
    path = require('path'),
    app = express(),
    checker = require('./checker'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

app.set('port', process.env.PORT || 3001);
app.use(bodyParser());
app.use(methodOverride());
app.use("/", express.static(path.join(__dirname, 'public')));
app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

app.get('/check', function(req, res) {
    console.log('Checking ' + req.query.screen_name);
    var screen_name = req.query.screen_name.replace('@', '');
    checker.twitter_check(screen_name, function(err, is_person, twitter_user) {
        if (err) {
            console.log(err);
            res.send({
                success: false,
                err: err
            })
        } else {
            res.send({
                success: true,
                screen_name: twitter_user.screen_name,
                is_person: is_person,
                profile_img: twitter_user.profile_image_url,
            })
        }
    })
})