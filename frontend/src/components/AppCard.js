import { useContext} from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import StartIcon from '@mui/icons-material/Start';
import PageviewIcon from '@mui/icons-material/Pageview';


function AppCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const {idAppPairs} = props;

    function handleLoadList(event) {
        event.stopPropagation();
        store.setCurrentApp(idAppPairs.id);
        //VIEW
    }
    function handleDeleteApp(event){
        event.stopPropagation();
        store.deleteApp(idAppPairs.id);
    }
    function handleStartApp(event,id){
        event.stopPropagation();
        store.startCurrentApp(id);
    }

    let cardElement = 
        <ListItem
            id={idAppPairs.id}
            key={idAppPairs.id}
            sx={{ marginTop: '15px', display: 'flex', p: 1 }}
            style={{ width: '100%', fontSize: '25pt', backgroundColor: '#9f98f0' }}
        >
            <Box sx={{ p: 1, flexGrow: 1 }}>
                {idAppPairs.name}
            </Box>
            <IconButton onClick={handleLoadList} aria-label='delete' style={{float:'right'}}>
                <PageviewIcon style={{ fontSize: '48pt'}} />
            </IconButton>
            <IconButton onClick={handleDeleteApp} aria-label='delete' style={{float:'right'}}>
                <DeleteIcon style={{ fontSize: '48pt'}} />
            </IconButton>
            <IconButton  onClick={(event) => {handleStartApp(event, idAppPairs.id)}}aria-label='delete' style={{float:'right'}}>
                <StartIcon style={{ fontSize: '48pt'}} />
            </IconButton>
        </ListItem>
    return (
        cardElement
    );
}

export default AppCard;