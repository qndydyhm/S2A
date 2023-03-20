import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import App_Info_Session from './App_Info_Session';
import View_Session from './View_Session';
import Data_Source_Session from './Data_Source_Session';
import Display from './Display';
import Siderbar from './SideBar';


export default function AppworkSpace() {
    const { store } = useContext(GlobalStoreContext);
    //the following attached are the result of choosen siderbar
    let res=store.currentSideBar=="None"?<div></div>:store.currentSideBar=="APP_INFO_SECTION"?<App_Info_Session/>:store.currentSideBar=="VIEW_SECTION"?<View_Session/>:store.currentSideBar=="DATA_SOURCE_SECTION"?<Data_Source_Session/>:<Display/>;

    return(
        <div id="session-body">
            <Siderbar/>
            <div id="content-session">
                {res}
            </div>

        </div>

    )
}