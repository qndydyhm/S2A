import { useContext, useState, useEffect, useRef } from "react"

export default function View_Detail_Session_Checkboxes(props){
    let key = props.id;
    let checkedColumns = props.checkedColumns;
    let isChecked = checkedColumns.includes(key);

    useEffect(() => {
        props.setCheckedColumns(checkedColumns);
    }, [checkedColumns]);

    const handleCheckboxChange = (event) => {
        if (event.target.checked) {
            props.setCheckedColumns([...checkedColumns, key]);
        } else {
            props.setCheckedColumns(checkedColumns.filter(column => column !== key));
        }
    }

    return(
        <div>
            <input type="checkbox" id={key} name={key} value={key} checked={isChecked} onChange={handleCheckboxChange}/>
            <label htmlFor={key}>{key}</label>
        </div>
    );
}

