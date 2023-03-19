
import { GlobalStoreContext } from '../store';
import Data_Source_Detail_Session from './Data_Source_Detail_Session';
import { useContext, useState } from 'react';
import {ListItem,Box} from '@mui/material';



export default function Data_Source_Card(props){
    const {dataSourcePair} = props;
    const { store } = useContext(GlobalStoreContext);
    function handleLoadCardDetail(event,id){
        store.setCurrentSelectedDataSource(id);
    }
    let detailSection = store.currentSelectedDataSource.id == dataSourcePair.id? <Data_Source_Detail_Session/>:<div></div>
    return (
        <ListItem
        id={dataSourcePair.id}
        key={dataSourcePair.id}
        sx={{ marginTop: '15px', display: 'flex', p: 1 }}
        style={{ width: '100%', fontSize: '25pt', backgroundColor: '#9f98f0' }}
        onClick={(event) => {
            handleLoadCardDetail(dataSourcePair.id)
        }}
    >
        <Box sx={{ p: 1, flexGrow: 1 }}>
            {dataSourcePair.name}
        </Box>
        {detailSection}
    </ListItem>
    );
}