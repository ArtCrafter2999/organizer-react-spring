import React, {useContext} from 'react';
import {SignContext} from "../../Contexts";
import {Navigate} from "react-router-dom";

const LogOut = () => {
	const {logOut} = useContext(SignContext);
	logOut();
	return <Navigate to={"/signing"}/>;
};

export default LogOut;