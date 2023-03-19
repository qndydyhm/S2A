import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';


export default function Column_Edit_Modal(){
    const { store } = useContext(GlobalStoreContext);
    const c = store.currentSelectedDatasource.columns[store.currentSelectedColumnIndex];
    const [name, setName] = useState(c.name);
    const [initial_value, setInitial_Value] = useState(c.initial_value);
    const [label, setLabel] = useState(c.label);
    const [reference, setReference] = useState(c.reference);
    const [type,setType] = usesTATE(c.type);

    function handleCancelEditColumn() {
        store.hideModal();
    }
    function handleConfirmEditColumn() {
        let newColumnData = {
            name: name,
            initial_value: initial_value,
            label:label,
            reference:reference,
            type:type
        };
        store.updateColumn(store.currentSelectedColumnIndex,newColumnData);    
        store.hideModal();
    }

    function handleUpdateName(event) {
        setName(event.target.value);
    }

    function handleUpdateInitial_Value(event) {
        setInitial_Value(event.target.value);
    }
    function handleUpdateLabel(event) {
        setLabel(event.target.value);
    }

    function handleUpdateReference(event) {
        setReference(event.target.value);
    }
    function handleUpdateType(event) {
        setType(event.target.value);
    }

    

    return(
        <Modal
        open={store.currentModal == "EDIT_COLUMN"}
    >
        <Box sx={style}>
        <div
        id="edit-song-modal"
        className="modal is-visible"
        data-animation="slideInOutLeft">
        <div
            id='edit-song-root'
            className="modal-root">
            <div
                id="edit-song-modal-header"
                className="modal-north">Edit Column</div>
            <div
                id="edit-song-modal-content"
                className="modal-center">
                <div className="modal-prompt">Name:</div>
                <input 
                    className='modal-textfield' 
                    type="text" 
                    defaultValue={name} 
                    onChange={handleUpdateName} />
                <div className="modal-prompt">Initial Value:</div>
                <input 
                    className='modal-textfield' 
                    type="text" 
                    defaultValue={initial_value} 
                    onChange={handleUpdateInitial_Value} />
                <div className="modal-prompt">label</div>
                <input 
                    className='modal-textfield' 
                    type="text" 
                    defaultValue={label} 
                    onChange={handleUpdateLabel} />
                <div  className="modal-prompt">refrence</div>
                <input 
                    className='modal-textfield' 
                    type="text" 
                    defaultValue={reference} 
                    onChange={handleUpdateReference} />
                <div className="modal-prompt">type</div>
                <input 
                    className='modal-textfield' 
                    type="text" 
                    defaultValue={type} 
                    onChange={handleUpdateType} />
            </div>
            <div className="modal-south">
                <input 
                    type="button" 
                    id="edit-song-confirm-button" 
                    className="modal-button" 
                    value='Confirm' 
                    onClick={handleConfirmEditColumn} />
                <input 
                    type="button" 
                    id="edit-song-cancel-button" 
                    className="modal-button" 
                    value='Cancel' 
                    onClick={handleCancelEditColumn} />
            </div>
        </div>
    </div>
        </Box>
    </Modal>
    )

}