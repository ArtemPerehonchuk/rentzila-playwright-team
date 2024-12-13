import { Locator } from "@playwright/test";

export function generateTenderDates() {
    const now = new Date();

    const startProposeDate = new Date(now.getTime() + 60 * 60 * 1000);

    const endProposeDate = new Date(startProposeDate.getTime() + 24 * 60 * 60 * 1000);

    const startTenderDate = new Date(endProposeDate.getTime() + 24 * 60 * 60 * 1000);

    const endTenderDate = new Date(startTenderDate.getTime() + 24 * 60 * 60 * 1000);

    return {
        start_propose_date: startProposeDate.toISOString(),
        end_propose_date: endProposeDate.toISOString(),
        start_tender_date: startTenderDate.toISOString(),
        end_tender_date: endTenderDate.toISOString(),
    };
}

export function parseDate(dateString: string): Date {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('.').map(Number);

    if (timePart) {
        const [hours, minutes] = timePart.split(':').map(Number);
        return new Date(year, month - 1, day, hours, minutes);
    }

    return new Date(year, month - 1, day);
}

export function parseApiDate(apiDateString: string, includeTime: boolean = false): Date {
    const date = new Date(apiDateString);

    if (includeTime) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
    }

    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export async function getDateRangeFromElement(locator: Locator): Promise<{ startDate: Date; endDate: Date }> {
    const dateText = await locator.innerText();
    const [startText, endText] = dateText.split(' - ');

    const startDate = parseDate(startText.trim());
    const endDate = parseDate(endText.trim());

    return { startDate, endDate };
}