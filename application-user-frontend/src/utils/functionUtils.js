// Format date
export const formatDate = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);

    return `${day}/${month}/${year}`
}


// Format date time -> return format: 
export const formatDateTime = (datetimeStr) => {
    const z = n => ('0' + n).slice(-2);
    return `${datetimeStr.getFullYear()}-${z(datetimeStr.getMonth() + 1)}-${z(datetimeStr.getDate())} ${z(datetimeStr.getHours())}:${z(datetimeStr.getMinutes())}:${z(datetimeStr.getSeconds())}`;
}

export const formatTime = (timeString) => {
    const time = new Date(timeString);

    const hours = `0${time.getHours()}`.slice(-2);
    const minutes = `0${time.getMinutes()}`.slice(-2);

    return `${hours}:${minutes}`
}

export const formatCurrency = (number) => {
    if (!number) return 0;
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}