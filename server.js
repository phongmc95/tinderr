const express = require('express');
const expressHbs = require('express-handlebars');

const app = express();
const port = process.env.PORT || '3000';
app.engine('.hbs',expressHbs());

app.set('view engine', '.hbs');
app.use('/component',express.static(__dirname +'/component'));
app.get('/', function (req, res){
    res.sendFile(__dirname+'/index.html')
});

app.get('/handlebars', function (req, res) {
    res.render('index');
})

app.listen(port);