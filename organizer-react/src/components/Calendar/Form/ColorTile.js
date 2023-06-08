import React from 'react';
import {AiOutlineCheck} from "react-icons/ai"
import styles from "./Form.module.scss"
const ColorTile = ({color, selected, onClick}) => {

    return(
        <button type={"button"} style={{backgroundColor:color}} onClick={() => onClick(color)}>{selected&&<AiOutlineCheck/>}</button>
    );
}

export default ColorTile;