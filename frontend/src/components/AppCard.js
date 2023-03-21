import { useContext} from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';



function AppCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const {idAppPairs} = props;


    function handleLoadList(event, id) {
        store.setCurrentApp(id);
        //VIEW
    }
    function handleDeleteApp(event){
        event.stopPropagation();
        store.deleteApp(idAppPairs.id);
    }

    let cardElement = 
        <ListItem
            id={idAppPairs.id}
            key={idAppPairs.id}
            sx={{ marginTop: '15px', display: 'flex', p: 1 }}
            style={{ width: '100%', fontSize: '25pt', backgroundColor: '#9f98f0' }}
            onClick={(event) => {
                handleLoadList(event, idAppPairs.id)
            }}
        >
            <Box sx={{ p: 1, flexGrow: 1 }}>
                {idAppPairs.name}
            </Box>
            <IconButton onClick={handleDeleteApp} aria-label='delete' style={{float:'right'}}>
                <DeleteIcon style={{ fontSize: '48pt'}} />
            </IconButton>
        </ListItem>
    return (
        cardElement
    );
}

export default AppCard;