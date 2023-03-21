import React, { useContext, useEffect,useState } from 'react'
import { GlobalStoreContext } from '../store'
import AppCard from './AppCard.js'
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import AppworkSpace from './AppworkSpace';
import AuthContext from '../auth'; 


const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const {auth} = useContext(AuthContext);


    useEffect(() => {
        store.loadIdAppPairs();
    }, []);

    function handleCreateNewApp() {
        store.createDefaultApp();
    }
    //load each app
    let appCard = store.idAppPairs ==null? <div></div>:
        <List sx={{ width: '50%', left: '5%', bgcolor: 'background.paper' }}>
            {
                store.idAppPairs.map((pair) => (
                    <AppCard
                        key={pair.id}
                        idAppPairs={pair}
                    />
                ))
            }
        </List>;
    //If user is not on any app's detail page, then the user's own apps should be display 
    let res = store.currentApp == null ?
        <div>
            <Fab
                color="inherit"
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewApp}
                disabled={!auth.isGlobalDeveloper}
            >
                <AddIcon />
            </Fab>
            <div id="app-list">
                {
                    appCard
                }
            </div>
        </div>
        : <AppworkSpace />;

    return (
        <div>
            {res}
        </div>
    );
}

export default HomeScreen;