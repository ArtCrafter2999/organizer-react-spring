import React, {useContext} from 'react';
import styles from "./TaskManager.module.scss";
import {Draggable, Droppable} from "react-beautiful-dnd";
import {TaskContext} from "../../Contexts";

const ColumnDroppable = ({statusId}) => {
	const {items, openForm} = useContext(TaskContext);
	let title;
	switch (statusId) {
		case 'todo':
			title = "Заплановано"
			break
		case 'inprogress':
			title = "В процесі"
			break;
		case 'completed':
			title = "Зроблено"
			break;
		default:
			break;
	}
	return (
		<div className={styles.column}>
			<div className={styles.listHeader}>
				<h2 className={styles.headerTitle}>{title}</h2>
			</div>
			<div className={styles.listBody}>
				<Droppable droppableId={statusId}>
					{(provided) => (<ul className={styles.list} {...provided.droppableProps} ref={provided.innerRef}>
						{items.map(({id, title, status}, index) => {
							if (status === statusId)
								return (<Draggable key={id} draggableId={id.toString()} index={index}>
									{(provided) => (<li className={styles.listItem}
														ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
										<p>
											{title}
										</p>
									</li>)}
								</Draggable>);
						})}
						{provided.placeholder}
					</ul>)}
				</Droppable>
			</div>
			<div className={styles.listFooter}>
				<button className={styles.footerButton} onClick={() => openForm(statusId)}>
					Додати
				</button>
			</div>
		</div>);
};

export default ColumnDroppable;