
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
    const [roleM, setRoleM] = useState(current_app.roleM);
    const [published, setPublished] = useState(current_app.published);


    function handleUpdateName(event) {
        setName(event.target.value);
    }

    function handleUpdateRoleM(event) {
        setRoleM(event.target.value);
    }
    function handleUpdatePublish(event){
        setPublished(!published);
    }
    function handleConfirmEditApp(event){
        store.editCurrentApp({_id:store.currentApp.id,name:name,roleM:roleM,published:published,views:store.currentApp.views,datasources:store.currentApp.datasources});

    }

    return (
        <div>
            <div>Creator:{current_app.creator}</div>
            <div id="name-prompt" className="prompt">Name:</div>
            <input
                className='modal-textfield'
                defaultValue={name}
                onChange={handleUpdateName} />
            <div id="roleM-prompt" className="prompt">role Membership:</div>
            {/* There are problem, it is a list with group of member, the implementation should looks like music playlist */}
            <input
                className='modal-textfield'
                type="text"
                defaultValue={roleM}
                onChange={handleUpdateRoleM} />
            <div>
            <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">Publish?</FormLabel>
                <FormControlLabel
                    control={
                        <Switch checked={published} onChange={handleUpdatePublish} />
                    }
                />
            </FormControl>
            </div>
            <input 
                        type="button" 
                        id="edi-app-confirm-button" 
                        value='Save' 
                        onClick={handleConfirmEditApp} />
        </div>
    )
}