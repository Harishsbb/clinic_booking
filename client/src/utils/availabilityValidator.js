export const isSlotAvailable = (dateStr, availability) => {
    if (!availability || availability.length === 0) return true;

    const date = new Date(dateStr);
    const day = date.getDay(); // 0-6 (Sun-Sat)
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeVal = hours * 60 + minutes;

    const daysMap = { 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6, 'Sun': 0 };

    for (const slot of availability) {
        // Example slot: "Mon-Sat 10am-2pm" or "Mon-Fri 9am-12pm"
        const [dayRange, timeRange] = slot.split(' ');
        if (!dayRange || !timeRange) continue;

        // Parse Days
        let allowedDays = [];
        if (dayRange.includes('-')) {
            const [startDay, endDay] = dayRange.split('-');
            const start = daysMap[startDay];
            const end = daysMap[endDay];
            if (start !== undefined && end !== undefined) {
                // Handle wrap around if needed (Sat-Mon), assuming standard Mon-Fri order here
                // Simple implementation for standard ranges
                if (start <= end) {
                    for (let i = start; i <= end; i++) allowedDays.push(i);
                } else {
                    for (let i = start; i <= 6; i++) allowedDays.push(i);
                    for (let i = 0; i <= end; i++) allowedDays.push(i);
                }
            }
        } else {
            // Single day or comma separated? Assuming simplified logic for now matching seed data
            // If "Mon,Wed" -> logic needed. Seed data uses ranges mostly.
            if (daysMap[dayRange] !== undefined) allowedDays.push(daysMap[dayRange]);
        }

        if (!allowedDays.includes(day)) continue;

        // Parse Time
        // "10am-2pm" -> 10:00 - 14:00
        const [startStr, endStr] = timeRange.split('-');

        const parseTime = (str) => {
            const match = str.match(/(\d+)(?::(\d+))?(am|pm)/i);
            if (!match) return null;
            let h = parseInt(match[1]);
            const m = match[2] ? parseInt(match[2]) : 0;
            const period = match[3].toLowerCase();

            if (period === 'pm' && h !== 12) h += 12;
            if (period === 'am' && h === 12) h = 0;
            return h * 60 + m;
        };

        const startTime = parseTime(startStr);
        const endTime = parseTime(endStr);

        if (startTime !== null && endTime !== null) {
            if (timeVal >= startTime && timeVal <= endTime) {
                return true;
            }
        }
    }

    return false;
};
