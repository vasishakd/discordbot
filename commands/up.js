module.exports = {
    name: 'up',
    description: 'Display current stream time.',
    execute(client, message, args, botconfig, isLive) {
        if (isLive) {
            let moment = require('moment');
            let now = moment().format('DD.MM.YYYY HH:mm:ss');
            let nowDate = moment(now, 'DD.MM.YYYY HH:mm:ss');
            let lastDate = moment(botconfig.last_stream_date, 'DD.MM.YYYY HH:mm:ss');
            let diff = nowDate.diff(lastDate, 'minutes');
            let hours = Math.floor(diff / 60);
            let minutes = diff % 60;
            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            message.channel.send('Время стрима: ' + hours + ':' + minutes);
        } else {
            message.channel.send('Стрим оффлайн');
        }
    },
};