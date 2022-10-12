function getCurrentTime(){
    let date = new Date();
    let now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                    date.getUTCDate(), date.getUTCHours(),
                    date.getUTCMinutes(), date.getUTCSeconds());
    let current = date.toISOString();
    current = current.substring(0, current.indexOf(".")).replace("T", " ");
    return current;
}

module.exports = {
    getCurrentTime
}