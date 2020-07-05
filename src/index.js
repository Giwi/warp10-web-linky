const WebServer = require('./webServer');
const conf = require('./conf');
const linky = require('./lib/linky');
const dayjs = require('dayjs')
const cron = require('node-cron');

cron.schedule('0 1 * * *', () => {

    const date = dayjs().subtract(5, 'd').format('YYYY-MM-DD')
    linky.config({
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
    }).updateHistory(date, 1).then(r => console.log(r));
});

// WebServer.start();