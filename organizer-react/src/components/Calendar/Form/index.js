import React, {useContext, useEffect, useState} from 'react';
import classNames from "classnames";
import ColorPicker from "./ColorPicker";
import {removeEvent, saveEvent} from "../../../api";
import {compareAsc, format, parseISO} from "date-fns";
import {EventsContext, FormContext} from "../../../Contexts";
import styles from "./Form.module.scss"

export const canMakeEvent = (events,{id, start, end, isEdit}) => {
    const entranceInfo = JSON.parse(localStorage.getItem("entranceInfo"));

    for (const otherEvent of events) {
        if (!(isEdit && otherEvent.id === id) // якщо це не той евент який я редагую
            &&// і
            !(// якщо жодна умова не спрацювала:
                (compareAsc(otherEvent.start, start) < 1 && compareAsc(otherEvent.end, start) < 1) // і початок і кінець евенту раніше ніж початок цього
                ||                                                                              // або
                (compareAsc(otherEvent.start, end) > -1 && compareAsc(otherEvent.end, end) > -1)    // і початок і кінець евенту пізніше ніж кінець цього
            ))//тоді
        {
            return false;//відправити не можна
        }
    }
    return true;
}
const Form = ({isOpen}) => {
    const [error, setError] = useState("")
    const {event, dispatch, closeForm} = useContext(FormContext);
    const {updateEvents, events} = useContext(EventsContext)

    useEffect(() => {
        setError('')
        const onKeyDown = e => {
            if (e.key === 'Escape') closeForm();
        }
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keypress", onKeyDown);
        }
    }, [])

    const handleInput = ({target: {name, value}}) => {
        if (name === "date" || name === "timeStart" || name === "timeEnd") {
            const {date, timeStart, timeEnd} = {...event, [name]: value};
            dispatch({
                data: {
                    [name]: value,
                    start: parseISO(`${date}T${timeStart}`),
                    end: parseISO(`${date}T${timeEnd}`)
                },
                type: "object"
            })
        } else {
            dispatch({
                data: {
                    name,
                    value
                },
                type: "name/value"
            });
        }
    }
    const handleColor = (color) => {
        dispatch({data: {name: "color", value: color}, type: "name/value"});
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const {title, start, end, color, isEdit} = event
        if (canMakeEvent(events, event)) {
            const eventToSend = {
                title,
                start: format(start, "yyyy-MM-dd'T'HH:mm"),
                end: format(end, "yyyy-MM-dd'T'HH:mm"),
                color
            };
            saveEvent(isEdit ? {...eventToSend, id: event.id} : eventToSend)
                .then(() => {
                        updateEvents();
                        closeForm();
                    }
                );
        } else {
            setError("Не можна задати подію поверх іншої події")
        }
    };
    const handleRemove = () => {
        removeEvent(event).then(() => {
                updateEvents();
                closeForm();
            }
        );
    }

    return (
        <div className={classNames(styles.formContent, {[styles.open]: isOpen})}>
            <h2>{event.isEdit ? 'Редагувати подію' : 'Створити подію'}</h2>
            <form onSubmit={handleSubmit}>
                {error && <span className={styles.error}>{error}</span>}
                <label htmlFor="title">Назва</label>
                <input
                    type="text"
                    name="title"
                    value={event.title}
                    onChange={handleInput}
                />
                <label htmlFor="date">Початок</label>
                <input
                    type="date"
                    name="date"
                    value={event.date}
                    onChange={handleInput}
                />

                <label htmlFor="start">Початок</label>
                <input
                    type="time"
                    name="timeStart"
                    value={event.timeStart}
                    onChange={handleInput}
                />

                <label htmlFor="end">Кінець</label>
                <input
                    type="time"
                    name="timeEnd"
                    value={event.timeEnd}
                    onChange={handleInput}
                />

                <label htmlFor="color">Колір</label>
                <input
                    type="text"
                    name="color"
                    value={event.color}
                    onChange={handleInput}
                />
                <ColorPicker color={event.color} setColor={handleColor}/>

                <div className={styles.formButtons}>
                    <button type="submit">{event.isEdit ? 'Змінити' : 'Створити'}</button>
                    {event.isEdit &&
                        <button className={styles.remove} type={"button"} onClick={handleRemove}>Видалити</button>}
                    <button className={styles.cancel} type="button" onClick={() => closeForm()}>
                        Відмінити
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Form;