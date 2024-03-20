
// we are getting local time on purpose to serve the user with what logged on their local date
export function DateFormat(date: Date){
    return `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`
}