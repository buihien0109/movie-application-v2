// Format date
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${day}-${month}-${year}`
}

export const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    const hour = `0${date.getHours()}`.slice(-2);
    const minute = `0${date.getMinutes()}`.slice(-2);
    return `${day}-${month}-${year} ${hour}:${minute}`
}

export const parseTimeToHHMM = (time) => {
    const date = new Date(time);
    const hour = `0${date.getHours()}`.slice(-2);
    const minute = `0${date.getMinutes()}`.slice(-2);
    return `${hour}:${minute}`;
}

export const formatCurrency = (number) => {
    if (!number) return 0;
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Range row return [A, Z]
export const rangeRow = (totalRows) => {
    const rows = [];
    for (let i = 0; i < totalRows; i++) {
        rows.push(String.fromCharCode(65 + i));
    }
    return rows;
}

// Range column return 1 -> totalColumns
export const rangeColumn = (totalColumns) => {
    return Array.from({ length: totalColumns }, (_, i) => i + 1);
}

// if same day with today is show button
export const isSameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear()
        && date1.getMonth() === date2.getMonth()
        && date1.getDate() === date2.getDate();

}