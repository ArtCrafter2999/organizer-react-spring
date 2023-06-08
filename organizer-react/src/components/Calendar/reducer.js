 const reducer = (prev, action) => {
    const {data, type} = action;
    if (type === "object") {
        return {...prev, ...data}
    }
    //if (type === "name/value")
    else {
        const {name, value} = data;
        return {...prev, [name]: value}
    }
}

export default reducer