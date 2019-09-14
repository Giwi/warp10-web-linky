const dayjs = require('dayjs');
const Linky = require('./lib/linky');
const Warp10 = require('./lib/warp10lib');
const conf = require('./conf');

const ws = `[ '${conf.warp10.rt}' 'enedis.linky' { 'pdl' '${conf.enedis.pdl}' } NOW -1 ] FETCH TICKLIST FLATTEN 0 GET`;

const warp10 = new Warp10(conf.warp10.w10URL, conf.warp10.wt, conf.warp10.rt);
console.log(ws)
warp10.exec(ws).then(result => {
    const lastTick = result.data[0] / 1000;
    console.log(dayjs(lastTick).format('YYYY-MM-DD'));
    Linky.config({
        warp10: {
            w10URL: conf.warp10.w10URL,
            rt: conf.warp10.rt,
            wt: conf.warp10.wt,
        },
        enedis: {
            login: conf.enedis.login,
            passwd: conf.enedis.password,
            pdl: conf.enedis.pdl
        },
    }).getBetween2Dates(dayjs(lastTick).subtract(1, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD'))
        .then(r => {
            console.log(r)
        });
}).catch(function (error) {
    if (error.response) {
        console.error(error.response.status, error.response.headers['x-warp10-error-message'])
    } else if (error.request) {
        console.log(error.request);
    } else {
        console.log('Error', error.message);
    }
});

