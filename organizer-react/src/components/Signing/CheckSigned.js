import React, {useContext, useEffect, useState} from 'react';
import {compareAsc, sub, parseISO} from "date-fns";
import {Navigate} from "react-router-dom";
import {checkAuthorization} from "../../api";
import {CircleLoader} from "react-spinners";
import {SignContext} from "../../Contexts";

const CheckSigned = (props) => {
	const {isAuthorized} = useContext(SignContext);
	if (isAuthorized) {
		return props.children;
	} else {
		return <Navigate to="/signing"/>;
	}
};

export default CheckSigned;