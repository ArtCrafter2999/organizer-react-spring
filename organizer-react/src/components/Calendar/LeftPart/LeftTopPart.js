import React, {useContext} from 'react';
import {format, getDate, getDay} from "date-fns";
import {CalendarContext, EventsContext} from "../../../Contexts";
import styles from "./LeftPart.module.scss"
import {Titles} from "../Titles";

const LeftTopPart = (props) => {
    const {currentDate, setShowMonth, setSelected} = useContext(CalendarContext);
    const {currentEvent} = useContext(EventsContext);
    const isHasCurrent = currentEvent !== undefined;

    return (
        <div className={styles.row}>
            <div className={styles.column} onClick={() => setShowMonth(currentDate)}>
                <div>
                    <p className={styles.smallTitles}>{Titles.months[currentDate.getMonth()]}</p>
                    <p className={styles.smallTitles}>{Titles.weekDaysFull[getDay(currentDate)]}</p>
                    <p className={styles.bigDate}>{getDate(currentDate)}</p>
                </div>
            </div>
            <div className={styles.column} onClick={() => {
                setSelected(currentDate);
            }}>
                <div>
                    <p className={styles.mediumTime}>{format(currentDate, 'HH:mm:ss')}</p>
                    <hr/>
                    {isHasCurrent?
                        <p className={styles.smallTitles}>Поточна подія: {currentEvent.title} <br/> з {format(currentEvent.start, 'HH:mm')} до {format(currentEvent.end, 'HH:mm')}</p>
                        :
                        <p className={styles.smallTitles}>Немає поточної події</p>
                    }
                </div>
            </div>
        </div>
    );
}

export default LeftTopPart;