import React, {useContext} from 'react';
import style from "./DayButton.module.scss";
import classNames from "classnames";
import {CalendarContext} from "../../../Contexts";
import {getDay} from "date-fns";
import {Titles} from "../Titles";

const DayButton = (props) => {
    const {setSelected, parsedMonth} = useContext(CalendarContext);
    const {day} = props;
    // console.log(day.week)
    // console.log(parsedMonth.weeks[day.week])
    // console.log(parsedMonth.weeks[day.week].selected)
    return (
        <button className={
            classNames(
                style.dayButton,
                {
                    [style.enabled]: props.showWeek || day.isInMonth,
                    [style.selected]: day.isSelected,
                    [style.current]: day.isCurrent,
                    [style.halfSelected]: props.showWeek || parsedMonth.weeks[day.weekIndex].selected
                }
            )
        } onClick={() => setSelected(day.date)}>
            {
                props.showWeek ?
                    <>
                        {Titles.weekDaysShort[getDay(day.date)]}
                        <br/>
                        {day.title}
                    </>
                    :
                    day.title
            }
        </button>
    );
}

export default DayButton;