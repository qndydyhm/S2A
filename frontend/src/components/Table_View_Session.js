import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import Table_View_Card from './Table_View_Card';
import List from '@mui/material/List';
import CircularProgress from '@mui/material/CircularProgress';

export default function Table_View_Session() {
    const { store } = useContext(GlobalStoreContext);


    let tableViewCard = store.idTableViewPairs!=null?
        <List sx={{ width: '70%', left: '5%', bgcolor: 'background.paper' }}>
            {
                store.idTableViewPairs.map((pair) => (
                    <Table_View_Card
                        key={pair.id}
                        name={pair.name}
                        id = {pair.id}
                    />
                ))
            }
        </List>:<div></div>;
    return (
        <div>
            {tableViewCard}
            {store.loadThePage?<CircularProgress color="secondary" />:<span></span>}
        </div>);

}