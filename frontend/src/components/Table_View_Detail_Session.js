import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper
} from '@mui/material';
import { useContext, useState } from 'react';
import PageviewIcon from '@mui/icons-material/Pageview';
import { GlobalStoreContext } from '../store';

export default function Table_View_Detail_Session(){
    const { store } = useContext(GlobalStoreContext);
    const [table,setTable] = useState(store.currentSelectedTableData);
    let res=table.columns!=null?
        <div style={{ width: '100%', fontSize: '15pt', backgroundColor: '#9f98a1' }}>
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
                                    <TableCell><PageviewIcon></PageviewIcon></TableCell>

                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
        :<div>No </div>;
        return (
            <div>
                {res}
            </div>);

}