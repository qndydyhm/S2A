
import { GlobalStoreContext } from '../store';
import Data_Source_Detail_Session from './Data_Source_Detail_Session';
import { useContext, useState } from 'react';
import { ListItem, Box } from '@mui/material';



export default function Data_Source_Card(props) {
    const { name, id } = props;
    const { store } = useContext(GlobalStoreContext);
    function handleLoadCardDetail() {
        store.setCurrentSelectedDataSource(id);
    }
    let detailSection = store.currentSelectedDatasource != null && store.currentSelectedDatasource._id == id ? <Data_Source_Detail_Session /> : <div></div>
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

        </div>

    );
}