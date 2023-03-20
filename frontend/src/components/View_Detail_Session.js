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
    console.log(selectedTable)
    const [tableName, setTableName] = useState(selectedTable.name);

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
    function handleConfirmEditView() {
        let allacts=0;
        if (allowAdd){allacts+=4}
        if (allowEdit) {allacts+=2}
        if (allowDelete) {allacts+=1}
        let updated_view = {_id: id,
                            name: name,
                            table: table,
                            columns:[],
                            viewtype:type,
                            allowedactions:allacts,
                            roles:[],
                            owner:current_view.owner}
        console.log("confirm", current_view, updated_view)
        store.editCurrentView(id, updated_view);
        store.loadViewPair();
    }
    //TODO: disalbe "add record" in detailed view, diable "edit record" in table view
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

            <input
            type="button"
            id="edit-v-confirm-button"
            value='Save'
            onClick={handleConfirmEditView} />

        </div>
    );
}