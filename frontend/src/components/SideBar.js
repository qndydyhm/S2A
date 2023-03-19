import React, { useContext, useEffect } from 'react'
import Button from '@mui/material/Button';
import GlobalStoreContext from '../store';


export default function Siderbar() {
    const { store } = useContext(GlobalStoreContext);

    function handleClickApp_Info(){
        store.setCurrentApp(store.currentApp.id);
        store.changeSideBarSection("APP_INFO_SECTION");
    }
    function handleClickData_Source(){
        store.loadIdDatasourcePair();
        store.changeSideBarSection("DATA_SOURCE_SECTION");
    }
    function handleClickViews(){
        store.changeSideBarSection("VIEW_SECTION");
        //REST OF VIEWS RELATED FUNCTION ARE WAITING TO BE IMPLEMENTED
    }
    function handleClickDisplay(){
        store.changeSideBarSection("PREVIEW_SECTION");
        //REST OF VIEWS RELATED FUNCTION ARE WAITING TO BE IMPLEMENTED
    }

    return(
        <div id="session-header">
                <Button variant="contained"  style={{ background: '#2E3B55' }} onClick={handleClickApp_Info}>App_Info</Button>
                <Button variant="contained"  style={{ background: '#2E3B55' }} onClick={handleClickData_Source}>DataSource</Button>
                <Button variant="contained"  style={{ background: '#2E3B55' }} onClick={handleClickViews}>Views</Button>
                <Button variant="contained"  style={{ background: '#2E3B55' }} onClick={handleClickDisplay}>Display</Button>
        </div>
    )

}