const linky = require('./enedis');
const dayjs = require('dayjs');
const Warp10 = require('./warp10lib');
const ora = require('ora');

/**
 *
 * @constructor
 */
function Linky() {

    this.login = '';
    this.passwd = '';
    this.pdl = '';
    this.w10 = undefined;

    /**
     *
     * @param params
     * @return {Linky}
     */
    this.config = function (params) {
        this.w10 = new Warp10(params.warp10.w10URL, params.warp10.wt, params.warp10.rt);
        this.login = params.enedis.login;
        this.passwd = params.enedis.passwd;
        this.pdl = params.enedis.pdl;
        return this;
    };
    /**
     *
     * @param startDate 'YYYY-MM-DD'
     * @param step
     * @return {Promise}
     */
    this.updateHistory = function (startDate, step = 1) {
        const now = dayjs().subtract(1, 'day');
        return this.getBetween2Dates(startDate, now.format('YYYY-MM-DD'))
    };

    /**
     *
     * @param startDate 'YYYY-MM-DD'
     * @param endDate 'YYYY-MM-DD'
     * @param step
     * @return {Promise<>}
     */
    this.getBetween2Dates = function (startDate, endDate, step = 1) {
        let start = dayjs(startDate, 'DD/MM/YYYY');
        let end = dayjs(endDate, 'DD/MM/YYYY');
        return new Promise((resolve, reject) => {
            let sum = 0;
            const spinner = ora(`Loading data from: ${startDate} to ${endDate}`).start();
            linky.login(this.login, this.passwd)
                .then(async session => {
                    while (end.isAfter(start)) {
                        const next = end.subtract(step, 'day');
                        spinner.text = `${end.diff(start, 'day')} days left, ${sum} records uploaded  from: ${next.format('DD/MM/YYYY')} to ${end.format('DD/MM/YYYY')}`;

                        try {
                            const data = await session.getHourlyData({
                                start: next.format('DD/MM/YYYY'),
                                end: end.format('DD/MM/YYYY')
                            });
                            await this.w10.update(this.pdl, data);
                            sum += data.length;
                        } catch (e) {
                            console.error(start.format('DD/MM/YYYY'), e);
                        }
                        end = next;
                    }
                    spinner.succeed(`${sum} records uploaded from: ${startDate} to ${endDate}`);
                    resolve(sum);
                }).catch(e => reject(e));
        });
    }
}

const instance = new Linky();
module.exports = instance;


