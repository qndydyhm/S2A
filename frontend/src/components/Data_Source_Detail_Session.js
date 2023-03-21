import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper
} from '@mui/material';
import { Add } from '@mui/icons-material';
import GlobalStoreContext from '../store';
import { useContext, useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import NativeSelect from '@mui/material/NativeSelect';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';




export default function Data_Source_Detail_Session() {
    //IN THEORY, I WILL CHANGE THE COLUMN BY setColumn() like AppCard,but due to some wired bug from react, the setState function can't work properly on the array
    //IN REACT DOCUMENT, IT MENTIONS THAT SOMETIMES setState can't perform immidieately, so I save to global state as well as the rest of value to the currenSelectedDatasource, and sned result to backend when user click save
    const { store } = useContext(GlobalStoreContext);
    let current_ds = store.currentSelectedDatasource;
    const [name] = useState(current_ds.name);
    const [url] = useState(current_ds.URL);
    const [key] = useState(current_ds.key);
    const [sheetindex] = useState(current_ds.sheetindex);
    const [columns,setColumn] = useState(current_ds.columns);

    useEffect(()=>{
        store.updateColumn(columns);
    },columns)



    function handleUpdateName(event) {
        store.currentSelectedDatasource.name = event.target.value;
        store.updateDataSourceLocally(store.currentSelectedDatasource);
    }
    function handleUpdateURL(event) {
        store.currentSelectedDatasource.URL = event.target.value;
        store.updateDataSourceLocally(store.currentSelectedDatasource);
    }

    function handleUpdateKey(event) {
        store.currentSelectedDatasource.key = event.target.value;
        store.updateDataSourceLocally(store.currentSelectedDatasource);
    }
    function handleUpdateSheetI(event) {
        if (/^\d+$/.test(event.target.value)) {
            store.currentSelectedDatasource.sheetindex = parseInt(event.target.value);
        }
        else {
            alert("Sheet index has to be integer only");
            store.currentSelectedDatasource.sheetindex = event.target.value;
        }
        store.updateDataSourceLocally(store.currentSelectedDatasource);
    }

    function handleConfirmEditDataSource() {
        if (!(/^\d+$/.test(store.currentSelectedDatasource.sheetindex))) {
            alert("sheetindex should be digit only");
            return;
        }
        store.confirmEditDataSource();
        //{ name: "Untitle", URL: " ", sheetindex: 1, key: " ", columns: [], owner: store.currentApp._id }
    }
    function handleUpdateColumn(event, index, tag) {
        event.stopPropagation();
        if (tag == "name") {
            columns[index].name = event.target.value;
        }
        else if (tag == "label") {
            columns[index].label = !columns[index].label;
        }
        else if (tag == "initvalue") {
            columns[index].initvalue = event.target.value;
        }
        else if (tag == "reference") {
            columns[index].reference = event.target.value;
        }
        else if (tag == "type") {
            columns[index].type = event.target.value;
        }
        store.updateColumn(columns);
    }
    function handleDeleteColumn(event,index){
        event.stopPropagation();
        columns.splice(index,1);
        setColumn(columns);
        store.updateColumn(columns);

        
    }

    function handleCreateNewColumn() {
        store.createNewColumn();
    }


    return (
        <div style={{ width: '100%', fontSize: '15pt', backgroundColor: '#9f98a1' }}>
            <div id="dsname-prompt" className="prompt">Name:</div>
            <input
                className='modal-textfield'
                defaultValue={name}
                onChange={handleUpdateName} />
            <div id="URL-prompt" className="prompt">URL:</div>
            <input
                className='modal-textfield'
                type="text"
                defaultValue={url}
                onChange={handleUpdateURL} />
            <div id="sheetI-prompt" className="prompt">Sheet Index:</div>
            <input
                className='modal-textfield'
                type="text"
                defaultValue={sheetindex}
                onChange={handleUpdateSheetI} />
            <div id="key-prompt" className="prompt">Key:</div>
            <input
                className='modal-textfield'
                type="text"
                defaultValue={key}
                onChange={handleUpdateKey} />
            <div>
                <div>
                    <Add onClick={handleCreateNewColumn} />
                </div>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 750 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell >name</TableCell>
                                <TableCell>Initial Value</TableCell>
                                <TableCell>Label</TableCell>
                                <TableCell>Reference</TableCell>
                                <TableCell>Type</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                columns.map((column) => (
                                    <TableRow
                                        key={columns.indexOf(column)}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell >
                                            <input
                                                className='modal-textfield'
                                                type="text"
                                                value={column.name}
                                                onChange={(e) => handleUpdateColumn(e, columns.indexOf(column), "name")}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <input
                                                className='modal-textfield'
                                                type="text"
                                                value={column.initvalue}
                                                onChange={(e) => handleUpdateColumn(e, columns.indexOf(column), "initvalue")}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <FormControl component="fieldset" variant="standard">
                                                <FormControlLabel
                                                    control={
                                                        <Switch checked={column.label} onChange={(e) => handleUpdateColumn(e, columns.indexOf(column), "label")} />
                                                    }
                                                />
                                            </FormControl>
                                        </TableCell>
                                        <TableCell align="right">
                                            <input
                                                className='modal-textfield'
                                                type="text"
                                                value={column.reference}
                                                onChange={(e) => handleUpdateColumn(e, columns.indexOf(column), "reference")}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <FormControl sx={{ m: 1, minWidth: 80 }}>
                                                <NativeSelect
                                                    onChange={(e) => handleUpdateColumn(e, columns.indexOf(column), "type")}
                                                    value={column.type}
                                                >
                                                    <option value={"Boolean"}>Boolean</option >
                                                    <option value={"Number"}>Number</option >
                                                    <option value={"Text"}>Text</option >
                                                    <option value={"URL"}>URL</option >
                                                </NativeSelect>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={(e) => handleDeleteColumn(e, columns.indexOf(column))} aria-label='delete' style={{ float: 'right' }}>
                                                <DeleteIcon style={{ fontSize: '48pt' }} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>

            </div>

            <input
                type="button"
                id="edit-ds-confirm-button"
                value='Save'
                onClick={handleConfirmEditDataSource} />
        </div>
    );

}
