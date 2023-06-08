import React from 'react';
import styles from "./Form.module.scss"
import ColorTile from "./ColorTile";

const ColorPicker = ({color, setColor}) => {

    return (
        <div className={styles.colorPicker}>
            <ColorTile color={"#9FDEE3"} onClick={setColor} selected={color === "#9FDEE3"}/>
            <ColorTile color={"#DC2227"} onClick={setColor} selected={color === "#DC2227"}/>
            <ColorTile color={"#D8AEFF"} onClick={setColor} selected={color === "#D8AEFF"}/>
            <ColorTile color={"#A4BDFD"} onClick={setColor} selected={color === "#A4BDFD"}/>
            <ColorTile color={"#5485EE"} onClick={setColor} selected={color === "#5485EE"}/>
            <ColorTile color={"#47D6DC"} onClick={setColor} selected={color === "#47D6DC"}/>

            <ColorTile color={"#7AE7BE"} onClick={setColor} selected={color === "#7AE7BE"}/>
            <ColorTile color={"#50B847"} onClick={setColor} selected={color === "#50B847"}/>
            <ColorTile color={"#FAD763"} onClick={setColor} selected={color === "#FAD763"}/>
            <ColorTile color={"#FFB878"} onClick={setColor} selected={color === "#FFB878"}/>
            <ColorTile color={"#FE887A"} onClick={setColor} selected={color === "#FE887A"}/>
            <ColorTile color={"#919191"} onClick={setColor} selected={color === "#919191"}/>
        </div>
    );
}

export default ColorPicker;