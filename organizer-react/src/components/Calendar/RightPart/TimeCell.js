import React from 'react';
import styles from "./RightPart.module.scss"
import classNames from "classnames";
import {format} from "date-fns";
import {shadeColor} from "../shadeColor";

const TimeCell = ({event, openForm}) => {

	const stripped = (color1, color2) => `repeating-linear-gradient(25deg, ${color1}, ${color1} 10px, ${color2} 10px, ${color2} 20px)`;

	let style = {}
	if (!event.current) {
		if (event.isFake) {
			if (event.canMake)
				style = {background: stripped(event.color, shadeColor(event.color, -40))}
			else style = {background: stripped('#FF0000', shadeColor('#FF0000', -40))}
		} else style = {background: event.color}
	}

	return (
		<td
			style={style}
			className={classNames({
				[styles.clearLines]: event.hasEvent && !event.begin,
				[styles.begin]: event.begin,
				[styles.end]: event.end,
				//[styles.newSelection]: event.isFake,
				[styles.current]: event.current
			})}
			onClick={() => {
				if (event.isFake || !event.hasEvent) openForm(event.dateTime);
				else openForm(event.dateTime, event.event);

			}}
		>{!event.title ? format(event.dateTime, "HH:mm") : <p>{event.title}</p>}</td>
	);
}

export default TimeCell;