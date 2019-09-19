const WebServer = require('./webServer');
const conf = require('./conf');
const linky = require('./lib/linky');

WebServer.start();
/*
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
}).updateHistory('2019-08-25', 1)
    .then(r => {
        console.log(r)
    });
*/