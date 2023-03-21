import { CheckBox } from "@mui/icons-material";
import GlobalStoreContext from "../store"
import { useContext, useState } from "react"
import { all } from "axios";
import { InputLabel, MenuItem, Select } from "@mui/material";

    //TODO: MINOR BUG: Now showing selected filter
    //TODO: check if editable columns belong to columns
    //TODO: check if roles are in roles list

    export default function View_Detail_Session(props){
    const { store } = useContext(GlobalStoreContext);
    const current_view = store.currentSelectedView;
    const idDataSourcePairs = store.currentApp.datasources;
    const fullTable = store.currentTableForView;
    const {id} = props;
    if (!store.currentTableForView && store.currentSelectedView.table!==" "){
        store.setTableForView(store.currentSelectedView.table);
    }
    const [name, setName] = useState(current_view.name);
    const [type, setType] = useState(current_view.viewtype);
    const [allowAdd, setAllowAdd] = useState(current_view.allowedactions>=4);
    const [allowEdit, setAllowEdit] = useState(current_view.allowedactions%4>=2);
    const [allowDelete, setAllowDelete] = useState(current_view.allowedactions%2==1);
    const [columns, setColumns] = useState(current_view.columns);
    const [columnsText, setColumnsText] = useState(current_view.columns);
    const [editableColumns, setEditableColumns] = useState(current_view.editablecolumns);
    const [editableColumnsText, setEditableColumnsText] = useState(current_view.editablecolumns);
    const [roles, setRoles] = useState(current_view.roles);
    const [rolesText, setRolesText] = useState(current_view.roles);

    var selectedTable = findObjectById(idDataSourcePairs, "id" ,current_view.table)
    if (fullTable){
        var selectedFilter = findObjectById(fullTable.columns, "_id" ,current_view.filter);
        var selectedUserFilter = findObjectById(fullTable.columns, "_id" ,current_view.userfilter);
        var selectedEditFilter = findObjectById(fullTable.columns, "_id" ,current_view.editfilter);
    }
    const [table, setTable] = useState(current_view.table);
    const [tableName, setTableName] = useState(selectedTable?selectedTable.name:null);
    const [filter, setFilter] = useState(current_view.filter);
    const [filterName, setFilterName] = useState(selectedFilter?selectedFilter.name:null);
    const [userFilter, setUserFilter] = useState(current_view.userfilter);
    const [userFilterName, setUserFilterName] = useState(selectedUserFilter?selectedUserFilter.name:null);
    const [editFilter, setEditFilter] = useState(current_view.editfilter);
    const [editFilterName, setEditFilterName] = useState(selectedEditFilter?selectedEditFilter.name:null);
    var filters = <div></div>
    var tableViewFilters = <div></div>
    var detailViewFilters = <div></div>
    if (table!==" " && fullTable){
        if(type==="table"){
            tableViewFilters = 
            <div id="table-view-filters">
                <div id="filter-select">
                    Select Filter: {filterName}
                    <Select
                        id="filter-select-menu"
                        value={''}
                        onChange={handleChangeFilter}
                        >
                            <MenuItem value={null} name={null} key={null}>No Filter</MenuItem>
                            {
                                fullTable.columns.filter(column => column.type=="Boolean").map((column) =>{
                                    return <MenuItem value={column} name={column.name} key={column.id}>{column.name}</MenuItem>
                                })
                            }
                    </Select>
                </div>
                <div id="user-filter-select">
                    Select User Filter: {userFilterName}
                    <Select
                        id="user-filter-select-menu"
                        value={''}
                        onChange={handleChangeUserFilter}
                        >
                            <MenuItem value={null} name={null} key={null}>No User Filter</MenuItem>
                            {
                                fullTable.columns.filter(column => column.type=="Text").map((column) =>{
                                    return <MenuItem value={column} name={column.name} key={column.id}>{column.name}</MenuItem>
                                })
                            }
                    </Select>
                </div>
            </div>
        }
        if(type==="detail"){
            detailViewFilters =
                <div id="detail-view-filters">
                    <div id="edit-filter-select">
                    Select Edit Filter: {editFilterName}
                    <Select
                        id="edit-filter-select-menu"
                        value={''}
                        onChange={handleChangeEditFilter}
                        >
                            <MenuItem value={null} name={null} key={null}>No Edit Filter</MenuItem>
                            {
                                fullTable.columns.filter(column => column.type=="Boolean").map((column) =>{
                                    return <MenuItem value={column} name={column.name} key={column.id}>{column.name}</MenuItem>
                                })
                            }
                    </Select>
                </div>
            </div>
        }
        filters = 
        <div id ="filters">
            {tableViewFilters}
            {detailViewFilters}
        </div>
    }
    var editableColumnsField = <div></div>
    if(type==="detail"){
        editableColumnsField =
            <div id="editable-columns-select">
                Editable Columns (Optional, Seperated by ","):
                <input
                className='modal-textfield'
                defaultValue={editableColumns}
                onKeyDown={handleUpdateEditableColumns}
                onChange={handleUpdateEditableColumnsText} />
            </div>
        if(document.getElementById("allow-add-checkbox")){document.getElementById("allow-add-checkbox").setAttribute("disabled",true);}
        if(document.getElementById("allow-edit-checkbox")){document.getElementById("allow-edit-checkbox").removeAttribute("disabled");}
    }
    if(type==="table"){
        if(document.getElementById("allow-add-checkbox")){document.getElementById("allow-add-checkbox").removeAttribute("disabled");}
        if(document.getElementById("allow-edit-checkbox")){document.getElementById("allow-edit-checkbox").setAttribute("disabled",true);}
    }
    function findObjectById(array, v ,id) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][v] === id) {return array[i];}
        }
        return null;
    }

    function handleUpdateName(event) {
        setName(event.target.value);
    }
    function handleToggleType() {
        type==="table"?setType("detail"):setType("table");
        if(type=="detail"){setAllowEdit(false);}
        else{setAllowAdd(false);}
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
    }
    function handleUpdateEditableColumns(event) {
        if (event.code=="Enter"){
            let text = editableColumnsText.replace(' ','').split(',');
            setEditableColumns(text);
        }
    }
    function handleUpdateRolesText(event) {
        setRolesText(event.target.value);
    }
    function handleUpdateRoles(event) {
        if (event.code=="Enter"){
            let text = rolesText.replace(' ','').split(',');
            setRoles(text);
        }
    }
    function handleChangeTable (event) {
        setTable(event.target.value.id);
        setTableName(event.target.value.name);
        store.setTableForView(event.target.value.id);
    }
    function handleChangeFilter (event) {
        if(!event.target.value){
            setFilter(null);
            setFilterName(null);
        }else{
            setFilter(event.target.value._id);
            setFilterName(event.target.value.name);
        }
    }
    function handleChangeUserFilter (event) {
        if(!event.target.value){
            setUserFilter(null);
            setUserFilterName(null);
        }else{
            setUserFilter(event.target.value._id);
            setUserFilterName(event.target.value.name);
        }
    }
    function handleChangeEditFilter (event) {
        if(!event.target.value){
            setEditFilter(null);
            setEditFilterName(null);
        }else{
            setEditFilter(event.target.value._id);
            setEditFilterName(event.target.value.name);
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
                            columns: columns,
                            viewtype: type,
                            allowedactions: allacts,
                            roles: roles,
                            owner: current_view.owner}
        if (editableColumns!=null){updated_view.editablecolumns = editableColumns;}
        if (filter!=null){updated_view.filter = filter;}
        if (userFilter!=null){updated_view.userfilter = userFilter;}
        if (editFilter!=null){updated_view.editfilter = editFilter;}
        console.log("view changes from: ", current_view, "to: ",updated_view)
        store.editCurrentView(id, updated_view);
        //store.loadViewPair();
    }

    return(
        <div style={{ width: '100%', fontSize: '15pt', backgroundColor: '#9f98a1' }}>
            <div id="dsname-prompt" className="prompt">Name: 
            <input
                className='modal-textfield'
                defaultValue={name}
                onChange={handleUpdateName} />
            View Type: 
            <input
            type="button"
            id="toggle-view-type-button"
            value={type}
            onClick={handleToggleType} />
            </div>
            <div>
                <input
                id="allow-add-checkbox"
                type="checkbox"
                checked={allowAdd}
                onChange={handleToggleAllowAdd}
                />
                Allow Add
            </div>
            <div>
                <input
                id="allow-edit-checkbox"
                type="checkbox"
                checked={allowEdit}
                onChange={handleToggleAllowEdit}
                />
                Allow Edit
            </div>
            <div>
                <input
                id="allow-delete-checkbox"
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
            {filters}
            <div id="columns-select">
                Columns (Seperated by ","):
                <input
                className='modal-textfield'
                defaultValue={columns}
                onKeyDown={handleUpdateColumns}
                onChange={handleUpdateColumnsText} />
            </div>
            {editableColumnsField}
            <div id="roles-select">
                Roles (Seperated by ","):
                <input
                className='modal-textfield'
                defaultValue={roles}
                onKeyDown={handleUpdateRoles}
                onChange={handleUpdateRolesText} />
            </div>

            <input
            type="button"
            id="edit-v-confirm-button"
            value='Save'
            onClick={handleConfirmEditView} />

        </div>
    );
}