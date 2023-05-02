import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import { useContext, useState } from 'react';
import PageviewIcon from '@mui/icons-material/Pageview';
import { GlobalStoreContext } from '../store';
import Add from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import DeleteIcon from '@mui/icons-material/Delete';
import Add_Record_Modal from './Add_Record_Modal';


export default function Table_View_Detail_Session() {
    const { store } = useContext(GlobalStoreContext);
    const [table, setTable] = useState(store.currentSelectedTableData);
    function handleLoadDetailView(table, key) {
        store.loadDetailView(table.id, key);
    }
    function handleCreateNewRecord(event) {
        event.stopPropagation();
        store.openAddRecord();
    }
    function handleDeleteRecord(event, key) {
        event.stopPropagation();
        store.deleteRecord(key);
    }
    let res = store.currentSelectedTableData.columns != null ?
        <div style={{ width: '100%', fontSize: '15pt', backgroundColor: '#9f98a1' }}>
            {store.currentSelectedTableData.add ?
                <Fab
                    color="inherit"
                    aria-label="add"
                    id="add-list-button"
                    onClick={(e)=>{handleCreateNewRecord(e)}}
                >
                    <Add />
                </Fab>:
                <span></span>
            }
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 750 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {
                                store.currentSelectedTableData.columns.map((column,j) => (
                                    <TableCell key={j}>{column}</TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            store.currentSelectedTableData.data.map((data,i) => (
                                <TableRow
                                    key={i}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    {
                                        data.map((each,index) => (
                                            <TableCell key={index}>{each}</TableCell>
                                        ))
                                    }
                                    <TableCell>
                                        {
                                            store.currentSelectedTableData.delete ?
                                                <IconButton aria-label='delete' style={{ float: 'right' }} onClick={(event) => handleDeleteRecord(event, store.currentSelectedTableData.keys[store.currentSelectedTableData.data.indexOf(data)])}>
                                                    <DeleteIcon style={{ fontSize: '20pt' }}
                                                    />
                                                </IconButton>
                                                : <span></span>

                                        }

                                    </TableCell>
                                    <TableCell><PageviewIcon
                                        onClick={(event) => { handleLoadDetailView(store.currentSelectedTableData, store.currentSelectedTableData.keys[store.currentSelectedTableData.data.indexOf(data)]) }}
                                    ></PageviewIcon>
                                    </TableCell>
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
                {store.onAddRecord?<Add_Record_Modal></Add_Record_Modal>:<span></span>}
            </div>);

}