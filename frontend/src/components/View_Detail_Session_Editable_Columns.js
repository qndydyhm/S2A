import { useContext, useState, useEffect, useRef } from "react"

//Current BUG: can only update one checkbox at a time

export default function View_Detail_Session_Editable_Columns(props){
    const [editableColumns, setEditableColumns] = useState(props.editableColumns);
    const [viewColumns, setViewColumns] = useState(props.columns);

    const containerRef = useRef(null);

    useEffect(() => {
        function createCheckboxes(){
            const container = containerRef.current;
            for (var i=0; i<viewColumns.length; i++) {
                if(!document.getElementById("editable-column-checkbox-"+i)){
                    var checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.value = viewColumns[i];
                    checkbox.id = "editable-column-checkbox-"+i;
                    var label = document.createElement("label");
                    label.innerHTML = viewColumns[i];
                    container.appendChild(checkbox);
                    container.appendChild(label);
                    if(editableColumns.includes(viewColumns[i])){
                        checkbox.checked = true;
                    }
                    checkbox.addEventListener('change', handleToggleCheck);
                }
            }
        }

        createCheckboxes();
    }, []);

    useEffect(() => {
        props.setEditableColumns(editableColumns);
    }, [editableColumns]);

    function handleToggleCheck(event){
        if (editableColumns.includes(event.target.value)) {
            setEditableColumns(editableColumns.filter((column) => column !== event.target.value));
        } else {
            setEditableColumns([...editableColumns, event.target.value]);
        }
    }

    return(<div ref={containerRef} id="checkbox-container"></div>);
}