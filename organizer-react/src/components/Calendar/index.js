import React, {useEffect, useReducer, useState} from 'react';
import {CalendarContext, EventsContext, FormContext} from "../../Contexts";
import style from "./CalendarPage.module.scss"
import LeftPart from "./LeftPart";
import RightPart from "./RightPart";
import {getParsedMonth} from "./parseMethods";
import {getAllEvents} from "../../api";
import {addHours, format, parseISO} from "date-fns";
import Form from "./Form";
import reducer from "./reducer";
import {HiMenu} from "react-icons/hi";
//import {getEventsFromServer} from "./getEventsFromServer";

const CalendarPage = () => {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selected, setSelected] = useState(new Date());
	const [showMonth, setShowMonth] = useState(new Date());
	const [events, setEvents] = useState([]);
	const [currentEvent, setCurrentEvent] = useState(undefined);
	const [formVisibility, setFormVisibility] = useState(false);
	const parsedMonth = getParsedMonth(showMonth, currentDate, selected)

	const [event, dispatch] = useReducer(reducer, {
		start: new Date(),
		end: new Date(),
		title: "Нова подія",
		date: "",
		timeStart: "",
		timeEnd: "",
		color: "#9FDEE3",
		isEdit: false,
		isFake: true
	})

	useEffect(() => {
		updateEvents();
		const intervals = [
			setInterval(() => {
				updateEvents();
			}, 60000),
			setInterval(() => {
				setCurrentDate(new Date());
			}, 1000),
		]
		return () => {
			intervals.forEach(id => clearInterval(id));
		}
	}, [])
	const updateEvents = () => {
		getAllEvents()
			.then(events => setEvents(events.map(e => ({...e, start: parseISO(e.start), end: parseISO(e.end)}))));

		//setEvents(getEventsFromServer());
	}
	const openForm = (date, event) => {
		setFormVisibility(true)
		if (event) {
			const {title, color, id, start, end} = event;
			dispatch({
				data: {
					id,
					title,
					color,
					start,
					end,
					date: format(start, "yyyy-MM-dd"),
					timeStart: format(start, "HH:mm"),
					timeEnd: format(end, "HH:mm"),
					isEdit: true
				},
				type: "object"
			})
		} else {
			const datePlusHour = addHours(date, 1);
			dispatch({
				data: {
					title: "Нова подія",
					color: "#9FDEE3",
					start: date,
					end: datePlusHour,
					date: format(date, "yyyy-MM-dd"),
					timeStart: format(date, "HH:mm"),
					timeEnd: format(datePlusHour, "HH:mm"),
					isEdit: false
				},
				type: "object"
			})
		}
	}
	const closeForm = () => {
		setFormVisibility(false)
	}

	return (
			<CalendarContext.Provider value={{
				currentDate,
				selected,
				setSelected,
				showMonth,
				setShowMonth,
				parsedMonth,
			}}>
				<EventsContext.Provider value={({
					events,
					updateEvents,
					currentEvent,
					setCurrentEvent
				})}>
					<FormContext.Provider value={{event, dispatch, openForm, closeForm, formVisibility}}>
						<div>
							<div className={style.column}>
								<LeftPart/>
								<Form isOpen={formVisibility}/>
								{/*{formVisibility ? <Form/> : <LeftPart/>}*/}
							</div>
							<div className={style.column}>
								<RightPart/>
							</div>
						</div>
					</FormContext.Provider>
				</EventsContext.Provider>
			</CalendarContext.Provider>
	);
};

export default CalendarPage;