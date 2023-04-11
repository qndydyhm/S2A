
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
    const [editRoleM, setEditRoleM] = useState(false);


    function handleUpdateName(event) {
        setName(event.target.value);
    }

    function handleUpdateRoleM(event) {
        setRoleM(event.target.value);
    }
    function handleUpdatePublish(event) {
        setPublished(!published);
    }
    function handleConfirmEditApp(event) {
        store.editCurrentApp({ _id: store.currentApp._id, name: name, roleM: roleM, published: published, views: store.currentApp.views, datasources: store.currentApp.datasources });
        setEditRoleM(false);
    }
    function handleToggleEditRoleM() {
        setEditRoleM(!editRoleM);
    }

    let roleM_display = <a href={roleM}>{roleM}</a>
    if (editRoleM){
        roleM_display =
        <input
           className='modal-textfield'
           type="text"
           defaultValue={roleM}
           style={{width:'500pt'}}
           onChange={handleUpdateRoleM} />
    }

    return (
        <div>
            <div>Creator: {current_app.creator}</div>
            <div id="name-prompt" className="prompt">Name: </div>
            <input
                className='modal-textfield'
                defaultValue={name}
                onChange={handleUpdateName} />
            <div id="roleM-prompt" className="prompt">Role Membership:</div>
            {/* There are problem, it is a list with group of member, the implementation should looks like music playlist */}
            <div>
                {roleM_display}
                <div>
                    <input
                    type="button"
                    id="edi-roleM-button"
                    value='Edit'
                    onClick={handleToggleEditRoleM} />
                </div>
                <div>Published:</div>
                <FormControl component="fieldset" variant="standard">
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