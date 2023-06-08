import React, {useReducer, useContext, useEffect, useId, useRef} from 'react';
import {NavLink} from 'react-router-dom';
import cx from 'classnames';
import styles from './NavMenu.module.scss';
import {HiMenu} from 'react-icons/hi';
import {AiOutlineClose} from 'react-icons/ai';
import navMenuReducer from "./navMenuReducer";
import {MENU_TYPES_ACTION} from "./constants";
import {SignContext} from "../../Contexts";

const NavMenu = () => {
	const [state, dispatch] = useReducer(navMenuReducer, {isMenuOpen: false});
	const {isAuthorized, user} = useContext(SignContext);

	const openNavMenu = () => {
		dispatch({type: MENU_TYPES_ACTION.MENU_OPEN})
	}
	const closeNavMenu = () => {
		dispatch({type: MENU_TYPES_ACTION.MENU_CLOSE})
	}

	const navRef = useRef(null);
	// const idNav = useId();


	useEffect(() => {
		// const handlerClick = ({ target }) => {
		//   if (isMenuOpen && !document.getElementById("navMenu").contains(target)) {
		//     closeNavMenu();
		//   }
		// }

		const handlerClick = ({target}) => {
			if (state.isMenuOpen && !navRef.current.contains(target)) {
				closeNavMenu();
			}
		}

		// const handlerClick = ({ target }) => {
		//   if (isMenuOpen && !document.getElementById(idNav).contains(target)) {
		//     closeNavMenu();
		//   }
		// }

		window.addEventListener('click', handlerClick);
		return () => {
			window.removeEventListener('click', handlerClick);
		};
	}, [state.isMenuOpen]);

	return (
		// <nav className={classNames} id="navMenu">
		//<nav className={classNames} id={idNav}>
		<>
			<nav className={cx(styles.container, {[styles.open]: state.isMenuOpen})} ref={navRef}>
				{state.isMenuOpen ?
					<button
						className={cx(styles.button)}
						onClick={closeNavMenu}>
						<AiOutlineClose/>
					</button>
					:
					<button
						className={cx(styles.button)}
						onClick={openNavMenu}>
						Menu
					</button>
				}
				<ul className={styles.list}>
					<li>
						<NavLink className={styles.link} to="/">Додому</NavLink>
					</li>
					<li>
						<NavLink className={styles.link} to="/calendar">Планувальник Подій</NavLink>
					</li>
					<li>
						<NavLink className={styles.link} to="/todo">Планувальник Завданнь</NavLink>
					</li>
				</ul>
				<div className={styles.down}>
					{
						isAuthorized?
							<ul className={styles.list}>
								<li>
									<NavLink className={styles.link} to="">{user.username}</NavLink>
								</li>
								<li>
									<NavLink className={styles.link} to="/logout">Logout</NavLink>
								</li>
							</ul>
							:
							<ul className={styles.list}>
								<li>
									<NavLink className={styles.link} to="/signing">Увійти</NavLink>
								</li>
							</ul>
					}
				</div>
			</nav>
		</>
	);
}

export default NavMenu;
