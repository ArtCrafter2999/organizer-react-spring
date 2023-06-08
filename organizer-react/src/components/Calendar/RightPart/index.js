import React, {useContext} from 'react';
import {CalendarContext, FormContext} from "../../../Contexts";
import DayButton from "../DayButton";
import styles from "./RightPart.module.scss"
import {useParsedWeek, useParsedWeekEvents} from "../parseMethods";
import classNames from "classnames";
import TimeCell from "./TimeCell";
import {compareAsc, format} from "date-fns";

const RightPart = (props) => {
	const {selected} = useContext(CalendarContext)
	const {formVisibility, openForm, event} = useContext(FormContext)
	const selectedWeek = useParsedWeek(selected);
	const parsedWeek = useParsedWeekEvents(selectedWeek);
	return (
		<>
			<div className={classNames(styles.full, styles.scroll)}>
				<table className={styles.table}>
					<thead>
					<tr>
						<th className={styles.timeColumn}>Час</th>
						{selectedWeek.days.map(d => <th key={d.title}><DayButton day={d} showWeek/></th>)}
					</tr>
					</thead>
					<tbody>
					{parsedWeek.map((r, h) =>
						<tr className={classNames({
							[styles.subLine]: r.subLine,
							[styles.line]: r.mainLine,
						})} key={h}>
							<td className={styles.timeColumn} key={h}>{r.hour}</td>
							{r.days.map((e, d) => <TimeCell
								key={`${d}-${h}`}
								event={e}
								openForm={openForm}/>
							)}
						</tr>
					)}
					</tbody>
				</table>
			</div>
		</>
	);
}

export default RightPart;