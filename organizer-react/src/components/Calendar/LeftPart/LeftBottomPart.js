import React, {useContext} from 'react';
import {add, getYear, sub} from "date-fns";
import {CalendarContext} from "../../../Contexts";
import style from "./LeftPart.module.scss"
import {Titles} from "../Titles";
import DayButton from "../DayButton";
import {AiOutlineRight, AiOutlineLeft} from 'react-icons/ai'
const LeftBottomPart = (props) => {
    const {parsedMonth, showMonth, setShowMonth} = useContext(CalendarContext);
    return (
        <>
            <div className={style.calendarPanel}>
                <button
                    className={style.panelButtons}
                    onClick={() => setShowMonth(sub(showMonth, {months:1}))}><AiOutlineLeft/></button>
                <p className={style.calendarTitle}>{`${Titles.months[showMonth.getMonth()]} ${getYear(showMonth)}`}</p>
                <button
                    className={style.panelButtons}
                    onClick={() => setShowMonth(add(showMonth, {months:1}))}><AiOutlineRight/></button>
            </div>
            <table className={style.calendarTable}>
                <thead>
                    <tr key={-1}>
                        {parsedMonth.headers.map(h => <th key={h}>{h}</th>)}
                    </tr>
                </thead>
                <tbody>
                {parsedMonth.weeks.map((w, i1) => {

                    return <tr key={i1}>{w.days.map((d, i2) => <td key={i2}><DayButton day={d}/></td>)}</tr>
                })}
                </tbody>
            </table>

        </>
    );
}


export default LeftBottomPart;