import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Checkbox
} from '@mui/material';
import { Add, Edit } from '@mui/icons-material';
import GlobalStoreContext from '../store';
import { useContext, useState } from 'react';


export default function Data_Source_Detail_Session() {
    const { store } = useContext(GlobalStoreContext);
    const current_ds = store.currentSelectedDatasource;
    const [name, setName] = useState(current_ds.name);
    const [url, setURL] = useState(current_ds.URL);
    const [key, setKey] = useState(current_ds.key);
    const [sheet_index, setSheet_Index] = useState(current_ds.sheet_index);
    const [columns, set_columns] = useState(current_ds.columns);

    function handleUpdateName(event) {
        setName(event.target.value);
    }
    function handleUpdateURL(event) {
        setURL(event.target.value);
    }

    function handleUpdateKey(event) {
        setKey(event.target.value);
    }
    function handleUpdateSheetI(event) {
        setSheet_Index(event.target.value);
    }
    function handleSetSelectedColumnIndex(column) {
        store.setCurrentSelectedColumnIndex(column);
    }
    function handleEditSelectedColumn() {
        if (store.currentSelectedColumn == null) {
            alert("Check Row you want to edit");
        }
        else {
            store.showModal("EDIT_COLUMN");
        }
    }

    function handleConfirmEditDataSource() {
        store.editCurrentDataSource({ id: store.currentDatasource.id, appId: store.currentDatasource.appId, name: name, url: url, key: key, sheet_index: sheet_index });
    }

    function handleCreateNewColumn() {
        console.log("WAITING TO CREATE NEW COLUMN");
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
                defaultValue={sheet_index}
                onChange={handleUpdateSheetI} />
            <div id="key-prompt" className="prompt">Key:</div>
            <input
                className='modal-textfield'
                type="text"
                defaultValue={key}
                onChange={handleUpdateKey} />
            <div>
                <div>
                    <Edit onClick={handleEditSelectedColumn} />
                    <Add onClick={handleCreateNewColumn}/>
                </div>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Check</TableCell>
                                <TableCell align="right">name</TableCell>
                                <TableCell align="right">Initial Value</TableCell>
                                <TableCell align="right">Label</TableCell>
                                <TableCell align="right">Reference</TableCell>
                                <TableCell align="right">Type</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {columns.map((column) => (
                                <TableRow
                                    key={column.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        <Checkbox
                                            edge="start"
                                            checked={store.currentSelectedColumnIndex == store.currentDatasource.indexOf(column)}
                                            disableRipple
                                            onClick={handleSetSelectedColumnIndex(store.currentDatasource.columns.indexOf(column))}
                                        />
                                    </TableCell>
                                    <TableCell align="right">{column.name}</TableCell>
                                    <TableCell align="right">{column.initial_value}</TableCell>
                                    <TableCell align="right">{column.label}</TableCell>
                                    <TableCell align="right">{column.reference}</TableCell>
                                    <TableCell align="right">{column.type}</TableCell>
                                </TableRow>
                            ))}
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