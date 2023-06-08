import React, {useState} from 'react';
import styles from './RemoveModal.module.scss';
import base from '../TaskManager.module.scss';
import cx from "classnames"
import {Droppable} from "react-beautiful-dnd";

const RemoveModal = ({isOpen}) => {

	return (
		<>
			<div className={cx(styles.modal)}>
				<Droppable droppableId={"remove"}>
					{(provided) => (
						<ul className={styles.list} {...provided.droppableProps} ref={provided.innerRef}>
							{provided.placeholder}
						</ul>
					)}
				</Droppable>
			</div>
			<div className={cx(styles.modal, {[styles.open]: isOpen})}>
				<div className={cx(styles.modalContent, styles.remove)}>
					<div className={cx(base.listHeader, styles.removeHeader)}>
						<h2 className={styles.headerTitle}>Видалити</h2>
					</div>
					<div className={base.listBody}>

					</div>
				</div>
			</div>
		</>
	);
};

export default RemoveModal;