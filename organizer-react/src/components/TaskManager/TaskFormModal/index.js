import React, {useRef, useState} from 'react';
import styles from './TaskFormModal.module.scss';
import {AiOutlineClose} from "react-icons/ai";
import cx from "classnames"

const TaskFormModal = ({baseStatus, setBaseStatus, isOpen, onClose, onSubmit}) => {
	const [title, setTitle] = useState('');
	const modalRef = useRef(null);
	const handleTitleChange = (event) => {
		setTitle(event.target.value);
	};

	const handleStatusChange = (event) => {
		setBaseStatus(event.target.value);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setTitle("")
		onSubmit({ title, status: baseStatus });
		onClose();
	};

	const handleClose = ({target}) => {
		if(!modalRef.current.contains(target)){
			onClose();
		}
	}

	return (
		<div className={cx(styles.modal, {[styles.open]: isOpen})} onClick={handleClose}>
			<div className={styles.modalContent} ref={modalRef}>
				<div className={styles.divClose}>
					<button className={styles.closeButton} onClick={onClose}>
						<AiOutlineClose/>
					</button>
				</div>

				<h2 className={styles.modalTitle}>Додати нове завдання</h2>
				<form onSubmit={handleSubmit}>
					<div className={styles.formGroup}>
						<label htmlFor="title">Назва:</label>
						<input
							type="text"
							id="title"
							value={title}
							onChange={handleTitleChange}
							className={styles.input}
						/>
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="status">Статус:</label>
						<select
							id="status"
							value={baseStatus}
							onChange={handleStatusChange}
							className={styles.select}
						>
							<option value="todo">Заплановано</option>
							<option value="inprogress">В процессі</option>
							<option value="completed">Зроблено</option>
						</select>
					</div>
					<div className={styles.formGroup}>
						<button type="submit" className={styles.button}>
							Створити завдання
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default TaskFormModal;