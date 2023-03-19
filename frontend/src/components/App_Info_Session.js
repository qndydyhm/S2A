
import { useContext, useState } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';



export default function App_Info_Session() {
    const { store } = useContext(GlobalStoreContext);
    const current_app = store.currentApp;
    const [name, setName] = useState(current_app.name);
    const [creator, setCreator] = useState(current_app.creator);
    const [roleM, setRoleM] = useState(current_app.roleM);
    const [published, setPublished] = useState(current_app.published);


    function handleUpdateName(event) {
        setName(event.target.value);
    }

    function handleUpdateCreator(event) {
        setCreator(event.target.value);
    }

    function handleUpdateRoleM(event) {
        setRoleM(event.target.value);
    }
    function handleUpdatePublish(event){
        setPublished(!published);
    }
    function handleConfirmEditApp(event){
        store.editCurrentApp({id:store.currentApp.id,name:name,creator:creator,roleM:roleM,published:published});

    }

    return (
        <div>
            <div id="name-prompt" className="prompt">Name:</div>
            <input
                className='modal-textfield'
                defaultValue={name}
                onChange={handleUpdateName} />
            <div id="Creator-prompt" className="prompt">Creator:</div>
            <input
                className='modal-textfield'
                type="text"
                defaultValue={creator}
                onChange={handleUpdateCreator} />
            <div id="roleM-prompt" className="prompt">role Membership:</div>
            {/* There are problem, it is a list with group of member, the implementation should looks like music playlist */}
            <input
                className='modal-textfield'
                type="text"
                defaultValue={creator}
                onChange={handleUpdateRoleM} />
            <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">Publish?</FormLabel>
                <FormControlLabel
                    control={
                        <Switch checked={published} onChange={handleUpdatePublish} />
                    }
                />
            </FormControl>
            <input 
                        type="button" 
                        id="edi-app-confirm-button" 
                        value='Save' 
                        onClick={handleConfirmEditApp} />
        </div>
    )
}