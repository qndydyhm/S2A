import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import List from '@mui/material/List';

import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper
} from '@mui/material';

export default function Detail_View_Session() {
    const { store } = useContext(GlobalStoreContext);
    const [table,setTable] = useState(store.currentSelectedDetailData);
    let res=store.currentSelectedDetailData!=null?
    <div style={{ width: '100%', fontSize: '15pt', backgroundColor: '#9f98a1' }}>
        <div>DETAIL VIEW:</div>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 750 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {
                        table.columns.map((column)=>(
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
                                    data.map((each)=>(
                                        <TableCell>{each}</TableCell>
                                    ))
                                }
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    </div>
    :<div></div>;
    return (
        <div>
            {res}
        </div>);

}