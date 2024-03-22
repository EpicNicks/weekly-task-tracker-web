
// we are getting local time on purpose to serve the user with what logged on their local date
export function dateFormat(date: Date, separator=''){
    return `${date.getFullYear()}${separator}${(date.getMonth() + 1).toString().padStart(2, '0')}${separator}${date.getDate().toString().padStart(2, '0')}`
}