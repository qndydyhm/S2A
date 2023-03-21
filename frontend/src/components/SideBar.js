import React, { useContext, useEffect } from 'react'
import { Button } from '@mui/material';
import GlobalStoreContext from '../store';
import Box, { BoxProps } from '@mui/material/Box';


export default function Siderbar() {
    const { store } = useContext(GlobalStoreContext);

    function handleClickApp_Info() {
        store.setCurrentApp(store.currentApp._id);
    }
    function handleClickData_Source() {
        store.loadIdDatasourcePair();
    }
    function handleClickViews() {
        store.loadViewPair();
    }
    function handleClickDisplay() {
        //REST OF VIEWS RELATED FUNCTION ARE WAITING TO BE IMPLEMENTED
    }

    return (
        <Box id="session-header"
            sx={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'row',
                p: 1,
                m: 1,
                bgcolor: 'background.paper',
                borderRadius: 1,
            }}>

            <Button variant="contained" style={{ background: '#2E3B55' }} onClick={handleClickApp_Info}>App_Info</Button>
            <Button variant="contained" style={{ background: '#2E3B55' }} onClick={handleClickData_Source}>DataSource</Button>
            <Button variant="contained" style={{ background: '#2E3B55' }} onClick={handleClickViews}>Views</Button>
            <Button variant="contained" style={{ background: '#2E3B55' }} onClick={handleClickDisplay}>Display</Button>
        </Box>
    )

}