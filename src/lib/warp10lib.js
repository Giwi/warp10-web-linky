const dayjs = require('dayjs');
const axios = require('axios');

/**
 *
 * @param w10URL Warp 10 endpoint
 * @param wt Write token
 * @param rt Read Token
 * @constructor
 */
function Warp10(w10URL, wt, rt) {
    this.w10URL = w10URL;
    this.wt = wt;
    this.rt = rt;
    this.exec = function (ws) {
        return axios.post(this.w10URL + '/exec', ws);
    };

    /**
     *
     * @param pdl
     * @param data
     * @return {Promise<>}
     */
    this.update = function (pdl, data) {
        return new Promise((resolve, reject) => {
            let inputFormat = '';
            data.forEach(d => {
                const ts = dayjs(d.date, 'YYYY-MM-DD HH:mm:ss').valueOf() * 1000;
                if (d.value) {
                    inputFormat += `${ts}// enedis.linky{unit=kW,subscribed=${d.puissanceSouscrite},pdl=${pdl}} ${d.value}
`;
                }
            });
            axios.post(this.w10URL + '/update', inputFormat, {
                headers: {
                    'X-Warp10-Token': this.wt,
                    'Transfer-Encoding': 'chunked'
                }
            }).then(s => resolve(s), e => reject(e));
        });
    }
}

module.exports = Warp10;
