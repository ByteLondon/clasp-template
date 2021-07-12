export const dateDaysAgo = (days:number):string => {
    const now = new Date()
    const millisPerDay = 1000 * 60 * 60 * 24
    const targetDateRaw = new Date(now.getTime() - (millisPerDay*days));
    const targetDateNoHours = Utilities.formatDate(targetDateRaw, 'Europe/London', 'yyyy-MM-dd')
    return  Utilities.formatDate(new Date(targetDateNoHours), 'Europe/London', "yyyy-MM-dd'T'HH:mm:ss.SSSZ")
}

export const getNumberOfDays = (start: string, end: string): number => {
    const startSeconds = new Date(start).getTime()
    const endSeconds = new Date(end).getTime()
    const millisecondsPerDay = 24 * 3600 * 1000
    return Math.floor((endSeconds - startSeconds) / millisecondsPerDay);
}
export const dateCalculator = (date: string, change: number): string => {
    const daySeconds = new Date(date).getTime()
    const millisecondsChange = 24 * 3600 * 1000 * change
    const newDateSecond = daySeconds + millisecondsChange
    const newDate = new Date(newDateSecond)
    return Utilities.formatDate(newDate, "Europe/London", 'yyyy-MM-dd')
}