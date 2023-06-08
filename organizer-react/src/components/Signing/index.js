import React, {useEffect, useState} from 'react';
import {SignContext} from "../../Contexts";
import {checkAuthorization, signInUser, signUpUser} from "../../api";
import {CircleLoader} from "react-spinners";

const Signing = ({children}) => {
	const [isReady, setReady] = useState(false);
	const [user, setUser] = useState(null)
	const [isAuthorized, setAuthorized] = useState(false)

	const checkAuth = () => {
		setReady(false);
		checkAuthorization().then(response => {
			setAuthorized(response.ok);
			if (response.ok)
				return response.json();
			else return null;
		}).then(user => {
			setUser(user);
			setReady(true);
		}).catch(() => {
			setUser(null);
			setReady(true);
		})
	}

	const signIn = (login, password) => {
		return signInUser({login, password})
			.then(() => {
				checkAuth();
			})

	}
	const signUp = (username, login, password) => {
		return signUpUser({username, login, password})
			.then(() => {
				checkAuth();
			})
	}
	const logOut = () => {
		localStorage.removeItem('token');
		setUser(null);
		setAuthorized(false);
	}

	useEffect(() => {
		checkAuth();
	}, [])

	if (!isReady)
		return <div style={({position: "absolute", top: "50%", left: "50%"})}>
			<CircleLoader
				color='#FFFFFF'
				loading={!isReady}
				size={300}
			/>
		</div>
	return (
		<SignContext.Provider value={{isAuthorized, user, checkAuth, signIn, signUp, logOut}}>
			{children}
		</SignContext.Provider>
	);
};

export default Signing;