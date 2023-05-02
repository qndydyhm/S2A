import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Modal from '@mui/material/Modal';



export default function Add_Record_Modal() {
    const { store } = useContext(GlobalStoreContext);
    const [input, setInput] = useState(-1);
    function handleClose() {
        store.setCurrentSelectedTableViewCard();
    }
    function handleUpdatetable(e){
        e.stopPropagation();
        setInput(e.target.value);
    }
    function handleaddRecord(){
        store.addNewRecord(input);
    }
        return (
            <Modal
                open={store.onAddRecord}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div style={{ width: '30%', fontSize: '15pt', backgroundColor: '#9f98a1',  position: 'absolute', top: '30%',left: '30%' }}>
                    <div>Enter your key:</div>
                <input
                    className='modal-textfield'
                    type="text"
                    value={input}
                    onChange={(e) => handleUpdatetable(e)}
                />
                    <input
                        type="button"
                        id="edit-ds-confirm-button"
                        value='Save'
                        onClick={handleaddRecord} />
                </div>
            </Modal>);

    }