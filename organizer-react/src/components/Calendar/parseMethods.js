import {
    addDays, addMinutes,
    compareAsc,
    getDate,
    getDay,
    getDaysInMonth,
    getHours,
    getMinutes,
    getWeek,
    isSameDay,
    subDays
} from "date-fns";
import {Titles} from "./Titles";
import {useContext, useState} from "react";
import {CalendarContext, EventsContext, FormContext} from "../../Contexts";
import calendar from "./index";
import {canMakeEvent} from "./Form";

const firstDayOfWeek = 1;

export const useParsedWeek = (date) => {
    const {currentDate} = useContext(CalendarContext);

    let pointerDay = new Date(date);
    while (getDay(pointerDay) !== firstDayOfWeek) {
        pointerDay = subDays(pointerDay, 1);
    }
    let week = {
        selected: true,
        days: []
    }
    for (let j = 0; j < 7; j++) {
        week.days[getDay(pointerDay)] = {
            title: getDate(pointerDay),
            date: pointerDay,
            isCurrent: isSameDay(pointerDay, currentDate),
            isSelected: isSameDay(pointerDay, date),
            weekIndex: week
        }
        pointerDay = addDays(pointerDay, 1);
    }
    for (let j = 0; j < firstDayOfWeek; j++) {
        week.days.push(week.days.shift());
    }

    return week;
}
export const getParsedMonth = (monthDate, currentDate, selectedDate) => {
    //initialize day pointer as first day
    let pointerDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    //initialize last day in the month
    const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), getDaysInMonth(monthDate));
    //move pointer backward until it doesn't point to the first day of the week
    while (getDay(pointerDay) !== firstDayOfWeek) {
        pointerDay = subDays(pointerDay, 1);
    }
    //initialize the month object that will be returned
    const month = {
        headers: Titles.weekDaysShort.map(d => d),
        weeks: []
    }
    month.headers.push(month.headers.shift());

    const AddDay = (week, date, selected, current) => {
        month.weeks[week].days[getDay(date)] = {
            title: getDate(date),
            date,
            isInMonth: date.getMonth() === monthDate.getMonth(),
            isSelected: selected,
            isCurrent: current,
            weekIndex: week
        }
    }
    for (let i = 0; compareAsc(pointerDay, lastDay) < 0; i++) {
        month.weeks[i] = {
            selected: getWeek(pointerDay) ===
                (getDay(selectedDate) < firstDayOfWeek ?
                    getWeek(selectedDate) - 1 :
                    getWeek(selectedDate)),
            days: []
        }
        for (let j = 0; j < 7; j++) {
            AddDay(i, pointerDay, isSameDay(pointerDay, selectedDate), isSameDay(pointerDay, currentDate))
            pointerDay = addDays(pointerDay, 1);
        }
    }
    for (let i = 0; i < month.weeks.length; i++) {
        for (let j = 0; j < firstDayOfWeek; j++) {
            month.weeks[i].days.push(month.weeks[i].days.shift());
        }
    }
    return month
}

const hours = 24
const minutesInHour = 60
const division = 12
export const useParsedWeekEvents = (week) => {
    const {currentDate} = useContext(CalendarContext);
    const {events, setCurrentEvent} = useContext(EventsContext);
    const {event, formVisibility} = useContext(FormContext);
    const sortedEvents = events.map(e => ({...e}));//copying array
    if(formVisibility) {
        sortedEvents.unshift({...event, canMake: canMakeEvent(events, event)});
    }
    sortedEvents.sort((a, b) => compareAsc(a.start, b.start));//sorting
    let eventRows = [];
    const getMinutePart = (date) => Math.floor(getHours(date) * division + Math.floor(getMinutes(date) / (minutesInHour / division)));
    const [pastEvent, setPastEvent] = useState({
        minutePart: getMinutePart(currentDate) % (minutesInHour / division),
        event: undefined
    })
    const updateCurrentEvent = (r, d) => {
        if (eventRows[r].days[d].current &&
            (getMinutePart(currentDate) % (minutesInHour / division) !== pastEvent.minutePart ||
                (eventRows[r].days[d].event !== undefined && pastEvent.event === undefined) ||
                eventRows[r].days[d]?.event?.id !== pastEvent?.event?.id)
        ) {
            //console.log("current event updated")
            setPastEvent({
                minutePart: getMinutePart(currentDate) % (minutesInHour / division),
                event: eventRows[r].days[d]?.event
            })
            setCurrentEvent(eventRows[r].days[d]?.event);
        }
    }
    const isCurrent = (r, d) => isSameDay(week.days[d].date, currentDate) && r === getMinutePart(currentDate)
    for (let r = 0; r < hours * division; r++) {
        eventRows[r] = {
            hour: r % division === 0 ? `${r / division}` : "",
            mainLine: r % division === 0,
            subLine: r % (division / 2) === 0,
            days: []
        }
        for (let d = 0; d < week.days.length; d++) {
            const curDayOfWeek = new Date(week.days[d].date.getFullYear(), week.days[d].date.getMonth(), week.days[d].date.getDate(), 0, 0);
            const thisDayEvents = sortedEvents.filter(e => isSameDay(week.days[d].date, e.start))//filer only this day
            const event = thisDayEvents.find(e => isSameDay(week.days[d].date, e.start) && r >= getMinutePart(e.start) && r < getMinutePart(e.end))//seeks event by the time
            if (event !== undefined) {//if there is event
                let isFirst = r === getMinutePart(event.start);
                eventRows[r].days[d] = {
                    hasEvent: true,
                    color: event.color,
                    title: isFirst ? event.title : "",
                    begin: isFirst,
                    end: r >= getMinutePart(event.end) - 1,
                    event,
                    isFake: event.isFake,
                    canMake: event.canMake,
                    current: isCurrent(r, d),
                    dateTime: addMinutes(curDayOfWeek, r * minutesInHour / division)
                }
                updateCurrentEvent(r, d);
            } else {
                eventRows[r].days[d] = {
                    hasEvent: false,
                    current: isCurrent(r, d),
                    dateTime: addMinutes(curDayOfWeek, r * minutesInHour / division)
                }
                updateCurrentEvent(r, d);
            }
        }
    }
    return eventRows;
}