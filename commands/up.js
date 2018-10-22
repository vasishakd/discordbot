module.exports = {
    name: 'up',
    description: 'Display current stream time.',
    execute(client, message, args, botconfig, isLive) {
        if (!isLive) {
            let now = new Date();
            let last = new Date(botconfig.last_stream_date);
            let diff = now - last;
            message.channel.send('Стрим онлайн: ' + msToTime(diff));
        } else {
            message.channel.send('Стрим оффлайн');
        }
    },
};

function msToTime(duration) {
  let seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    if (hours === '00') return minutes + ":" + seconds;

    return hours + ":" + minutes + ":" + seconds;
}