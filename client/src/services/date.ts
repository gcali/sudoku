export const formatDate = (date: Date): string => {
    const now = date;
    let month: number | string = (now.getMonth() + 1);               
    let day: number | string = now.getDate();
    if (month < 10) 
        month = "0" + month;
    if (day < 10) 
        day = "0" + day;
    const today = now.getFullYear() + '-' + month + '-' + day;
    return today;
}

const padLeft = (s: number): string => {
    if (s < 10) {
        return "0" + s;
    }
    return s.toString();
}

export const formatTime = (date: Date): string => {
    return `${padLeft(date.getHours())}:${padLeft(date.getMinutes())}:${padLeft(date.getSeconds())}`;
}