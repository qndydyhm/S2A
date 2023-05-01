import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import List from '@mui/material/List';
import CreateIcon from '@mui/icons-material/Create';
import Modal from '@mui/material/Modal';
import PageviewIcon from '@mui/icons-material/Pageview';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper
} from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function Detail_View_Session() {
    const { store } = useContext(GlobalStoreContext);
    const [table, setTable] = useState(store.currentSelectedDetailData);
    function handleClose() {
        store.closeDetailView();

    }
    function handleUpdatetable(e, index) {
        e.stopPropagation();
        store.currentSelectedDetailData.data[0][index] = e.target.value;
        table.data[0][index]=e.target.value;
        store.updateRecordLocally(table);
        

    }
    function openEditRecord() {
        store.openEditRecord();
    }
    function handleConfirmEditDetailView() {
        store.updateRecord(table);

    }
    let res = store.currentSelectedDetailData != null ?
        <div style={{ width: '100%', fontSize: '15pt', backgroundColor: '#9f98a1' }}>
            <div>DETAIL VIEW:</div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 750 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {
                                table.columns.map((column) => (
                                    <TableCell>{column}</TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            table.data.map((data) => (
                                <TableRow
                                    key={table.data.indexOf(data)}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    {
                                        data.map((each, index) => (
                                            <TableCell>{
                                                store.editRecord ?
                                                    <input
                                                        className='modal-textfield'
                                                        type="text"
                                                        value={each}
                                                        onChange={(e) => handleUpdatetable(e, index)}
                                                    />
                                                    : each}</TableCell>

                                        ))

                                    }
                                    <TableCell><CreateIcon
                                        onClick={(event) => { openEditRecord() }}
                                    ></CreateIcon></TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {
                store.openEditRecord ?
                    <input
                        type="button"
                        id="edit-ds-confirm-button"
                        value='Save'
                        onClick={handleConfirmEditDetailView} /> :
                    <div></div>
            }
        </div>
        : <div></div>;
    return (
        <div>
            <Modal
                open={store.currentSelectedDetailData == null ? false : true}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                {res}
            </Modal>
        </div>);

}