const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const Linky = require('./lib/linky');
const dayjs = require('dayjs');
const conf = require('./conf');
/**
 *
 * @constructor
 */
function WebServer() {
    this.port = 3000;
    this.app = express();
    this.jsonParser = bodyParser.json();

    this.app.engine('.hbs', exphbs({
        defaultLayout: 'main',
        extname: '.hbs',
        layoutsDir: path.join(__dirname, 'views/layouts'),
        helpers: {
            eq: function (expr1, expr2) {
                return expr1 === expr2;
                },
        }
    }));
    this.app.set('view engine', '.hbs');
    this.app.set('views', path.join(__dirname, 'views'));

    this.app.get('/overview', (request, response) => {
        response.render('overview', {
          rt: conf.warp10.rt,
          w10URL: conf.warp10.w10URL,
          pdl: conf.enedis.pdl,
          current: 'overview'
        })
    });
    this.app.get('/monotonic', (request, response) => {
        response.render('monotonic', {
          rt: conf.warp10.rt,
          w10URL: conf.warp10.w10URL,
          pdl: conf.enedis.pdl,
          current: 'monotonic'
        })
    });

    this.app.get('/spectrum', (request, response) => {
        response.render('spectrum', {
          rt: conf.warp10.rt,
          w10URL: conf.warp10.w10URL,
          pdl: conf.enedis.pdl,
          current: 'spectrum'
        })
    });

    this.app.get('/', (request, response) => {
        response.render('home', {
            current: 'home'
        })
    });

    this.app.get('/history', (request, response) => {
        response.render('history', {
            current: 'history'
        })
    });


    this.app.post('/api/history', this.jsonParser,  function (req, res) {
        // retrieve user posted data from the body
        const data = req.body;
        const l = Linky.config({
            warp10: {
                w10URL: conf.warp10.w10URL,
                rt: conf.warp10.rt,
                wt: conf.warp10.wt,
            },
            enedis: {
                login: data.login,
                passwd: data.password,
                pdl: conf.enedis.pdl
            },
        });
        l.updateHistory(dayjs(data.start).format('YYYY-MM-DD'), 10).then(r => {
            console.log(r + ' records uploaded');
            res.send('successfully registered');
        }).catch(e => {
            res.send('successfully registered');
        });
    });

    this.app.use((err, request, response, next) => {
        // log the error, for now just console.log
        console.log(err);
        response.status(500).send('Something broke!')
    });
    /**
     *
     * @return {Promise<>}
     */
    this.start = function () {
        return new Promise((resolve, reject) => {
            this.app.listen(this.port, (err) => {
                if (err) {
                    console.log('something bad happened', err);
                    reject(err);
                }

                console.log(`server is listening on ${this.port}`)
                resolve();
            });
        });
    }
}

const instance = new WebServer();
module.exports = instance;
