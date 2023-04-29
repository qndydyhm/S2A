
import { GlobalStoreContext } from '../store';
import Table_View_Detail_Session from './Table_View_Detail_Session';
import { useContext, useState } from 'react';
import { ListItem, Box } from '@mui/material';
import Detail_View_Session from './Detail_View_Session';





export default function Table_View_Card(props) {
    const { name, id } = props;
    const { store } = useContext(GlobalStoreContext);
    function handleLoadCardDetail() {
        store.setCurrentSelectedTableViewCard(id);
    }
    let detailSection = store.currentSelectedTableData != null && store.currentSelectedTableData.id == id ? <Table_View_Detail_Session /> : <div></div>
    let detailSection1 = store.currentSelectedDetailData!=null &&  store.currentSelectedTableData.id == id? <Detail_View_Session></Detail_View_Session>:<div></div>
    return (
        <div>
            <ListItem
                sx={{ marginTop: '15px', display: 'flex', p: 1 }}
                style={{ width: '100%', fontSize: '25pt', backgroundColor: '#9f98f0' }}
                onClick={(event) => {
                    handleLoadCardDetail()
                }}
            >
                <Box sx={{ p: 1, flexGrow: 1 }}>
                    {name}
                </Box>
            </ListItem>
            {detailSection}
            {detailSection1}
        </div>

    );
}