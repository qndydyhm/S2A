import { CheckBox } from "@mui/icons-material";
import GlobalStoreContext from "../store"
import { useContext, useState } from "react"
import { all } from "axios";
import { InputLabel, MenuItem, Select } from "@mui/material";

export default function View_Detail_Session(props){
    const { store } = useContext(GlobalStoreContext);
    const current_view = store.currentSelectedView;
    const idDataSourcePairs = store.currentApp.datasources;
    var selectedTable = findObjectById(idDataSourcePairs, current_view.table)
    const {id} = props;
    const [name, setName] = useState(current_view.name);
    const [type, setType] = useState(current_view.viewtype);
    const [allowAdd, setAllowAdd] = useState(current_view.allowedactions>=4);
    const [allowEdit, setAllowEdit] = useState(current_view.allowedactions%4>=2);
    const [allowDelete, setAllowDelete] = useState(current_view.allowedactions%2==1);
    const [table, setTable] = useState(current_view.table);
    const [tableName, setTableName] = useState(selectedTable.name);
    const [columns, setColumns] = useState(current_view.columns);
    const [columnsText, setColumnsText] = useState(current_view.columns);
    const [editableColumns, setEditableColumns] = useState(current_view.editablecolumns);
    const [editableColumnsText, setEditableColumnsText] = useState(current_view.editablecolumns);

    function findObjectById(array, id) {
        for (var i = 0; i < array.length; i++) {
            if (array[i]['id'] === id) {return array[i];}
        }
        return null;
    }

    function handleUpdateName(event) {
        setName(event.target.value);
    }
    function handleToggleType() {
        type=="table"?setType("detail"):setType("table");
    }
    function handleToggleAllowAdd() {
        setAllowAdd(!allowAdd);
    }
    function handleToggleAllowEdit() {
        setAllowEdit(!allowEdit);
    }
    function handleToggleAllowDelete() {
        setAllowDelete(!allowDelete);
    }
    function handleChangeTable (event) {
        console.log(event.target.value)
        setTable(event.target.value.id);
        setTableName(event.target.value.name);
    }
    function handleUpdateColumnsText(event) {
        setColumnsText(event.target.value);
    }
    function handleUpdateColumns(event) {
        if (event.code=="Enter"){
            let text = columnsText.replace(' ','').split(',');
            setColumns(text);
        }
    }
    function handleUpdateEditableColumnsText(event) {
        setEditableColumnsText(event.target.value);
        console.log(editableColumnsText)
    }
    function handleUpdateEditableColumns(event) {
        if (event.code=="Enter"){
            console.log(editableColumnsText)
            let text = editableColumnsText.replace(' ','').split(',');
            setEditableColumns(text);
        }
    }
    function handleConfirmEditView() {
        let allacts=0;
        if (allowAdd){allacts+=4}
        if (allowEdit) {allacts+=2}
        if (allowDelete) {allacts+=1}
        let updated_view = {_id: id,
                            name: name,
                            table: table,
                            columns:columns,
                            viewtype:type,
                            allowedactions:allacts,
                            roles:[],
                            owner:current_view.owner}
        if (editableColumns!=null){
            updated_view.editablecolumns = editableColumns;
        }
        console.log("confirm", current_view, updated_view)
        store.editCurrentView(id, updated_view);
        store.loadViewPair();
    }
    //TODO: disalbe "add record" in detailed view, diable "edit record" in table view
    //TODO: check if editable columns belong to columns
    return(
        <div style={{ width: '100%', fontSize: '15pt', backgroundColor: '#9f98a1' }}>
            <div id="dsname-prompt" className="prompt">Name:</div>
            <input
                className='modal-textfield'
                defaultValue={name}
                onChange={handleUpdateName} />
            <div>
            <input
            type="button"
            id="toggle-view-type-button"
            value={type}
            onClick={handleToggleType} />
            </div>
            <div id="allow-add-checkbox">
                <input
                type="checkbox"
                checked={allowAdd}
                onChange={handleToggleAllowAdd}
                />
                Allow Add
            </div>
            <div id="allow-edit-checkbox">
                <input
                type="checkbox"
                checked={allowEdit}
                onChange={handleToggleAllowEdit}
                />
                Allow Edit
            </div>
            <div id="allow-delete-checkbox">
                <input
                type="checkbox"
                checked={allowDelete}
                onChange={handleToggleAllowDelete}
                />
                Allow Delete
            </div>
            <div id="table-select">
                Select Table: {tableName}
                <Select
                    id="tabel-select-menu"
                    value={''}
                    onChange={handleChangeTable}
                    >
                        {
                            idDataSourcePairs.map((dataSource) =>{
                                return <MenuItem value={dataSource} name={dataSource.name} key={dataSource.id}>{dataSource.name}</MenuItem>
                            })
                        }
                </Select>
            </div>
            <div id="columns-select">
                Columns (Seperated by ","):
                <input
                className='modal-textfield'
                defaultValue={columns}
                onKeyDown={handleUpdateColumns}
                onChange={handleUpdateColumnsText} />
            </div>
            <div id="editable-columns-select">
                Editable Columns (Optional, Seperated by ","):
                <input
                className='modal-textfield'
                defaultValue={editableColumns}
                onKeyDown={handleUpdateEditableColumns}
                onChange={handleUpdateEditableColumnsText} />
            </div>

            <input
            type="button"
            id="edit-v-confirm-button"
            value='Save'
            onClick={handleConfirmEditView} />

        </div>
    );
}