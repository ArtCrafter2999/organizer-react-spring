import React, {useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from "./EntrancePage.module.scss"
import classNames from "classnames";
import {signInUser, signUpUser} from "../../api";
import {SignContext} from "../../Contexts";

function EntrancePage() {
	const [serverError, setServerError] = useState('')
	const [loginError, setLoginError] = useState(false);
	const [usernameError, setUsernameError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [login, setLogin] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isRegistration, setRegistration] = useState(false);
	const navigate = useNavigate();
	const {signUp, signIn} = useContext(SignContext)

	const handleTabClick = (isRegistration) => {
		setLogin('')
		setUsername('')
		setPassword('')
		setLoginError(false);
		setPasswordError(false);
		setUsernameError(false);
		setServerError('');
		setRegistration(isRegistration);
	}

	const handleSignUp = (event) => {
		event.preventDefault();
		//console.log(`${!login}, ${!password}, ${!username}`)
		setLoginError(!login);
		setPasswordError(!password);
		setUsernameError(!username);
		if (username && login && password) {
			signUp(username, login, password)
				.then(() => {
					navigate('/');
				})
				.catch(err => {
					setServerError(err.message);
				})
		}
	}
	const handleSignIn = (event) => {
		event.preventDefault();
		setLoginError(!login);
		setPasswordError(!password);
		if (login && password) {
			signIn(login, password)
				.then(() => {
					navigate('/');
				})
				.catch(err => {
					setServerError(err.message);
				})
		}
	};

	const signUpForm = (
		<form onSubmit={handleSignUp}>
			{serverError && <span className={styles.error}>{serverError}</span>}
			<div>
				<label>Логін:</label>
				<input type="text" className={classNames({[styles.error]: loginError})} value={login}
					   onChange={(e) => setLogin(e.target.value)}/>
			</div>
			<div>
				<label>Ім'я користувача:</label>
				<input type="text" className={classNames({[styles.error]: usernameError})} value={username}
					   onChange={(e) => setUsername(e.target.value)}/>
			</div>
			<div>
				<label>Пароль:</label>
				<input type="password" className={classNames({[styles.error]: passwordError})} value={password}
					   onChange={(e) => setPassword(e.target.value)}/>
			</div>
			<div>
				<button type="submit">Зареєструватися</button>
			</div>
		</form>
	);
	const signInForm = (
		<form onSubmit={handleSignIn}>
			{serverError && <span className={styles.error}>{serverError}</span>}
			<div>
				<label>Логін:</label>
				<input type="text" className={classNames({[styles.error]: loginError})}
					   value={login} onChange={(e) => setLogin(e.target.value)}/>
			</div>
			<div>
				<label>Пароль:</label>
				<input type="password" value={password} className={classNames({[styles.error]: passwordError})}
					   onChange={(e) => setPassword(e.target.value)}/>
			</div>
			<div>
				<button type="submit">Увійти</button>
			</div>
		</form>
	)


	return (
		<div>
			<div className={styles.tab}>
				<button className={classNames({[styles.active]: !isRegistration})}
						onClick={() => handleTabClick(false)}>Увійти
				</button>
				<button className={classNames({[styles.active]: isRegistration})}
						onClick={() => handleTabClick(true)}>Зареєструватися
				</button>
			</div>
			{isRegistration ? signUpForm : signInForm}
		</div>
	);
}

export default EntrancePage;