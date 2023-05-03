import { useContext, useState, useEffect, useRef } from "react"
import View_Detail_Session_Checkboxes from "./View_Detail_Session_Checkboxes";

export default function View_Detail_Session_Columns(props){
    let viewColumns = props.columns;
    viewColumns.sort();
    const [checkedColumns, setCheckedColumns] = useState(props.editableColumns);

    useEffect(() => {
        props.setEditableColumns(checkedColumns);
    }, [checkedColumns]);

    return(<div class="checkbox_wrapper">
        {
            viewColumns.map((box) => (
                <View_Detail_Session_Checkboxes
                    id={box}
                    checkedColumns={checkedColumns}
                    setCheckedColumns = {setCheckedColumns}
                />
            ))
        }
    </div>);
}
