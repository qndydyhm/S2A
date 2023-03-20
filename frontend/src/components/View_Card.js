import { GlobalStoreContext } from '../store';
import View_Detail_Session from './View_Detail_Session';
import { useContext, useState } from 'react';
import {ListItem,Box} from '@mui/material';



export default function View_Card(props){
    const {name,id} = props;
    const { store } = useContext(GlobalStoreContext);
    function handleLoadCardDetail(event,id){
        store.setCurrentSelectedView(id);
    }
    let detailSection = store.currentSelectedView!=null&&store.currentSelectedView.id ==id? <View_Detail_Session/>:<div></div>
    return (
        <ListItem
        id={id}
        sx={{ marginTop: '15px', display: 'flex', p: 1 }}
        style={{ width: '100%', fontSize: '25pt', backgroundColor: '#9f98f0' }}
        onClick={(event) => {
            handleLoadCardDetail(id)
        }}
    >
        <Box sx={{ p: 1, flexGrow: 1 }}>
            {name}
        </Box>
        {detailSection}
    </ListItem>
    );
}