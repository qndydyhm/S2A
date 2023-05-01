import GlobalStoreContext from "../store"
import View_Detail_Session from "./View_Detail_Session";
import { useContext, useState, useEffect, useRef } from "react"

//Current BUG: can only update one checkbox at a time

export default function View_Detail_Session_Columns(props){
    let fullTable = props.fullTable;
    const [viewColumns, setViewColumns] = useState(props.columns);
    let tableColumns = fullTable.columns.map((item)=>{return item.name});
    console.log(tableColumns, viewColumns)

    const containerRef = useRef(null);

    useEffect(() => {
        function createCheckboxes(){
            const container = containerRef.current;
            for (var i=0; i<tableColumns.length; i++) {
                if(!document.getElementById("column-checkbox-"+i)){
                    var checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.value = tableColumns[i];
                    checkbox.id = "column-checkbox-"+i;
                    var label = document.createElement("label");
                    label.innerHTML = tableColumns[i];
                    container.appendChild(checkbox);
                    container.appendChild(label);
                    if(viewColumns.includes(tableColumns[i])){
                        checkbox.checked = true;
                    }
                    checkbox.addEventListener('change', handleToggleCheck);
                }
            }
        }

        createCheckboxes();
    }, []);

    useEffect(() => {
        props.setColumns(viewColumns);
    }, [viewColumns]);

    function handleToggleCheck(event){
        console.log("HERE1",viewColumns)
        if (viewColumns.includes(event.target.value)) {
            setViewColumns(viewColumns.filter((column) => column !== event.target.value));
        } else {
            setViewColumns([...viewColumns, event.target.value]);
        }
        
        console.log("HERE2",viewColumns)
    }

    return(<div ref={containerRef} id="checkbox-container"></div>);
}



