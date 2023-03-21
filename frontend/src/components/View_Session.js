import { useContext } from "react";
import Add from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import { GlobalStoreContext } from '../store';
import List from '@mui/material/List';
import View_Card from "./View_Card.js"

export default function View_Session(){
    const { store } = useContext(GlobalStoreContext);
    function handleCreateNewView(){
        store.createNewView();
    }
    
    let viewCard = store.viewPairs!=null?
        <List sx={{ width: '50%', left: '5%', bgcolor: 'background.paper' }}>
        {
            store.viewPairs.map((pair) => (
                <View_Card
                    key={pair._id}
                    name={pair.name}
                    id = {pair._id}
                />
            ))
        }
    </List>:<div></div>;

    return(
    <div>
        <Fab
            color="inherit"
            aria-label="add"
            id="add-list-button"
            onClick={handleCreateNewView}
        >
            <Add />
        </Fab>
        {viewCard}
    </div>);
}