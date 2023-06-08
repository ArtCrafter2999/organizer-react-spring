import React, {useEffect, useState} from 'react';
import styles from './TaskManager.module.scss';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {TaskContext} from "../../Contexts";
import ColumnDroppable from "./ColumnDroppable";
import TaskFormModal from "./TaskFormModal";
import RemoveModal from "./RemoveModal";
import {getAllTasks, removeTask, saveTask, saveTasks} from "../../api";

// const listData = [
// 	{
// 		id: 1,
// 		title: "test 1",
// 		status: "todo"
// 	},
// 	{
// 		id: 2,
// 		title: "test 2",
// 		status: "todo"
// 	},
// 	{
// 		id: 3,
// 		title: "test 3",
// 		status: "todo"
// 	},
// 	{
// 		id: 4,
// 		title: "test 4",
// 		status: "todo"
// 	},
// 	{
// 		id: 5,
// 		title: "test 4",
// 		status: "todo"
// 	},
// 	{
// 		id: 6,
// 		title: "test 4",
// 		status: "todo"
// 	}, {
// 		id: 7,
// 		title: "test 4",
// 		status: "todo"
// 	}, {
// 		id: 8,
// 		title: "test 4",
// 		status: "todo"
// 	}, {
// 		id: 9,
// 		title: "test 4",
// 		status: "todo"
// 	},
// 	{
// 		id: 10,
// 		title: "test 4",
// 		status: "todo"
// 	},
// 	{
// 		id: 11,
// 		title: "test 4",
// 		status: "todo"
// 	},
// 	{
// 		id: 12,
// 		title: "test 4",
// 		status: "todo"
// 	},
// 	{
// 		id: 13,
// 		title: "test 4",
// 		status: "todo"
// 	},
// 	{
// 		id: 14,
// 		title: "test 4",
// 		status: "todo"
// 	},
// 	{
// 		id: 15,
// 		title: "test 4",
// 		status: "todo"
// 	}, {
// 		id: 16,
// 		title: "test 4",
// 		status: "todo"
// 	}, {
// 		id: 17,
// 		title: "test 4",
// 		status: "todo"
// 	},
// ]

const TaskManager = () => {
	const [items, updateItems] = useState([]); /*listData*/
	const [isFormOpen, setFormOpen] = useState(false)
	const [isRemoveOpen, setRemoveOpen] = useState(false)
	const [baseStatus, setBaseStatus] = useState("todo")
	const [isCursorInBottom, setIsCursorInBottom] = useState(false);
	const updateTasks = () => {
		getAllTasks().then(response => {
			const array1 = [];
			response.map(i => array1[i.index] = i)
			const array2 = array1.filter(function( element ) {
				return element !== undefined;
			});
			if(JSON.stringify(array1) !== JSON.stringify(array2))
				saveTasks(array2.map((item, index) => ({index, ...item})));
			updateItems(array2);
		});
	}

	useEffect(() => {
		updateTasks();

		const handleMouseMove = (event) => {
			const windowHeight = window.innerHeight;
			const cursorY = event.clientY;

			setIsCursorInBottom(cursorY >= windowHeight * 0.60); // Adjust the threshold as needed
		};

		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);
	const handleOnDragEnd = (result) => {
		//console.log(result);
		setRemoveOpen(false)
		if (!result.destination) return;
		const newItems = Array.from(items);
		const [reorderedItem] = newItems.splice(result.source.index, 1);
		if (result.destination.droppableId !== 'remove') {
			reorderedItem.status = result.destination.droppableId
			newItems.splice(result.destination.index, 0, reorderedItem);
		}
		else {
			//console.log("removeTask()")
			removeTask(reorderedItem)
		}
		//console.log(newItems.map((item, index) => ({index, ...item})))
		saveTasks(newItems.map((item, index) => ({index, ...item})));

		updateItems(newItems);
	}
	const handelOnDragUpdate = () => {
		// setRemoveOpen(true);
		if (isCursorInBottom) setRemoveOpen(true);
		if (!isCursorInBottom) setRemoveOpen(false);
	}
	const openForm = (status) => {
		setFormOpen(true);
		setBaseStatus(status);
	}
	const closeForm = () => {
		setFormOpen(false);
	}
	const submitTask = (newTask) => {
		const newItems = Array.from(items);
		//newTask.id = newItems.length + 1 //TODO: remove


		console.log(newItems);
		saveTask({...newTask, index: newItems.length}).then(task => {
			newItems.push(task);
			updateItems(newItems);
		});
	}
	console.log(items);
	return (
		<TaskContext.Provider value={{items, openForm}}>
			<DragDropContext onDragEnd={handleOnDragEnd} onDragUpdate={handelOnDragUpdate}>

				<div className={styles.row}>
					<ColumnDroppable statusId={'todo'}/>
					<ColumnDroppable statusId={'inprogress'}/>
					<ColumnDroppable statusId={'completed'}/>
					<TaskFormModal baseStatus={baseStatus} setBaseStatus={setBaseStatus} isOpen={isFormOpen}
								   onSubmit={submitTask} onClose={closeForm}/>
				</div>
				<RemoveModal isOpen={isRemoveOpen}/>
			</DragDropContext>

		</TaskContext.Provider>
	);
	//

};

export default TaskManager;