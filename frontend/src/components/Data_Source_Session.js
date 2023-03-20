import { useContext } from "react";
import Add from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import { GlobalStoreContext } from '../store';
import List from '@mui/material/List';
import Data_Source_Card from "./Data_Source_Card";

export default function Data_Source_Session() {
    const { store } = useContext(GlobalStoreContext);
    function handleCreateNewDataSource(){
        store.createNewDataSource();
    }

    let datasourceCard = store.idDataSourcePairs!=null?
        <List sx={{ width: '50%', left: '5%', bgcolor: 'background.paper' }}>
            {
                store.idDataSourcePairs.map((pair) => (
                    <Data_Source_Card
                        key={pair.id}
                        name={pair.name}
                        id = {pair.id}
                    />
                ))
            }
        </List>:<div></div>;
    return (
        <div>
            <Fab
                color="inherit"
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewDataSource}
            >
                <Add />
            </Fab>
            {datasourceCard}
            <div>DATA SOURCE SESSION</div>
        </div>);
}