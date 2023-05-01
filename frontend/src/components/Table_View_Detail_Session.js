import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper,IconButton
} from '@mui/material';
import { useContext, useState } from 'react';
import PageviewIcon from '@mui/icons-material/Pageview';
import { GlobalStoreContext } from '../store';
import Add from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import DeleteIcon from '@mui/icons-material/Delete';


export default function Table_View_Detail_Session() {
    const { store } = useContext(GlobalStoreContext);
    // const [table, setTable] = useState(store.currentSelectedTableData);
    function handleLoadDetailView(table,key) {
        store.loadDetailView(table.id,key);
    }
    function handleCreateNewRecord() {
        store.addNewRecord();
    }
    function handleDeleteRecord(event,key) {
        event.stopPropagation();
        store.deleteRecord(key);
    }
    let res = store.currentSelectedTableData.columns != null ?
        <div style={{ width: '100%', fontSize: '15pt', backgroundColor: '#9f98a1' }}>
            <Fab
                color="inherit"
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewRecord}
            >
                <Add />
            </Fab>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 750 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {
                                store.currentSelectedTableData.columns.map((column) => (
                                    <TableCell>{column}</TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            store.currentSelectedTableData.data.map((data) => (
                                <TableRow
                                    key={store.currentSelectedTableData.data.indexOf(data)}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    {
                                        data.map((each) => (
                                            <TableCell>{each}</TableCell>
                                        ))
                                    }
                                    <TableCell>
                                        {/* onClick={handleDeleteRecord(table.key[table.data.indexOf(data)])} */}
                                        <IconButton aria-label='delete' style={{ float: 'right' }}>
                                            <DeleteIcon style={{ fontSize: '20pt' }} 
                                            onClick={(event)=>handleDeleteRecord(event,store.currentSelectedTableData.keys[store.currentSelectedTableData.data.indexOf(data)])}
                                            />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell><PageviewIcon
                                        onClick={(event) => { handleLoadDetailView(store.currentSelectedTableData,store.currentSelectedTableData.keys[store.currentSelectedTableData.data.indexOf(data)]) }}
                                    ></PageviewIcon></TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
        : <div></div>;
    return (
        <div>
            {res}
        </div>);

}