const Linky = require('./lib/linky');
const conf = require('./conf');


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
}).updateHistory('2018-09-01', 30).then(r => {
  console.log(r)
});
