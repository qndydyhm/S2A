import { createContext, useContext, useState } from 'react'
import AuthContext from '../auth';
import api from './store-request-api';

export const GlobalStoreActionType = {
    //app section
    LOAD_APP_LIST: "LOAD_APP_LIST",
    OPEN_APP: "OPEN_APP",
    CLOSE_APP: "CLOSE_CURRENT_APP",
    UPDATE_APP: "UPDATE_APP",
    //data source section
    LOAD_DATA_SOURCE_LIST: "LOAD_DATA_SOURCE_LIST",
    CREATE_DATA_SOURCE: "CREATE_DATA_SOURCE",
    UPDATE_DATA_SOURCE: "UPDATE_DATA_SOURCE",
    SET_CURRENT_SELECTED_DATA_SOURCE: "SET_CURRENT_SELECTED_DATA_SOURCE",
    //detail of data source
    SET_CURRENT_SELECTED_COLUMN: "SET_CURRENT_SELECTED_COLUMN",
    //Return to the main page
    GO_TO_MAIN_SCREEN: "GO_TO_MAIN_SCREEN",
    //Modal
    SHOW_MODAL: "SHOW_MODAL",
    HIDE_MODAL: "HIDE_MODAL",

    //view section
    LOAD_VIEW_LIST: "LOAD_VIEW_LIST",
    CREATE_VIEW: "CREATE_VIEW",
    UPDATE_VIEW: "UPDATE_VIEW",

}

//None:User is in non-app editing page
//APP_INFO_SECTION: User is in app-editing page, and in the app-info section trying to edit it
//VIEW_SECTION: User is in app-editing page, and in the view section trying to edit it
//DATA_SOURCE_SECTION: User is in app-editing page, and in the data source section trying to edit it
//PREVIEW_SECTION: User has already finished editing their info, it will show the result
const CurrentSideBar = {
    NONE: "NONE",
    APP_INFO_SECTION: "APP_INFO_SECTION",
    VIEW_SECTION: "VIEW_SECTION",
    DATA_SOURCE_SECTION: "DATA_SOURCE_SECTION",
    PREVIEW_SECTION: "PREVIEW_SECTION",
}

const currentModal = {
    NONE: "NONE",
    EDIT_COLUMN: "EDIT_COLUMN",
}

export const GlobalStoreContext = createContext({});
function GlobalStoreContextProvider(props) {
    const [store, setStore] = useState({
        currentSideBar: CurrentSideBar.NONE,//{_id,name,published}
        idAppPairs: [],//[{id,title}....]
        idDataSourcePairs: [],//[{id,dataSource.name}]
        currentApp: null, //{id,name,creator,roleM,publish}if currentApp ! = null, then currently developer is in the editing page,
        currentSelectedDatasource: null,//{id,name,url,sheet_index,key}
        currentSelectedColumnIndex: -1,
        currentModal: currentModal.NONE,
        //view
        viewPairs: [],//[{id,name}....]
        currentSelectedViewId: null,//the id of selected view,
    });
    const { auth } = useContext(AuthContext);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalStoreActionType.CLOSE_APP: {
                return setStore({
                    currentApp: null,
                });
            }
            case GlobalStoreActionType.GO_TO_MAIN_SCREEN: {
                return setStore({
                    currentModal: currentModal.NONE,
                    idAppPairs: payload.pairs,
                    currentApp: null
                });
            }
            case GlobalStoreActionType.LOAD_APP_LIST: {
                return setStore({
                    idAppPairs: payload.pairs,
                    currentApp: store.currentApp,
                    idDataSourcePairs: store.idDataSourcePairs
                });
            }
            case GlobalStoreActionType.UPDATE_APP: {
                return setStore({
                    currentApp: {
                        id: store.currentApp.id,
                        name: payload.app.name,
                        roleM: payload.app.roleM,
                        published: payload.app.published
                    },
                    currentSideBar: CurrentSideBar.APP_INFO_SECTION,
                });
            }
            case GlobalStoreActionType.UPDATE_DATA_SOURCE: {
                return setStore({
                    currentSelectedDatasource: payload.data_source,
                    currentModal: currentModal.NONE,
                    idDataSourcePairs: payload.pairs,
                    currentSideBar:store.currentSideBar,
                    currentApp:store.currentApp

                });
            }
            case GlobalStoreActionType.LOAD_VIEW_LIST: {
                return setStore({
                    viewPairs: payload.view,

                });
            }
            case GlobalStoreActionType.OPEN_APP: {
                return setStore({
                    currentApp: payload.app,
                    currentSideBar: CurrentSideBar.APP_INFO_SECTION,

                });
            }

            case GlobalStoreActionType.SET_CURRENT_SELECTED_COLUMN_INDEX: {
                return setStore({
                    currentSelectedColumnIndex: payload.index

                });
            }

            case GlobalStoreActionType.SHOW_MODAL: {
                return setStore({
                    modal: payload.modal
                });
            }
            case GlobalStoreActionType.HIDE_MODAL: {
                return setStore({
                    currentSelectedColumnIndex: null,
                    currentModal: currentModal.NONE
                });
            }
            case GlobalStoreActionType.LOAD_DATA_SOURCE_LIST: {
                return setStore({
                    idDataSourcePairs: payload.pairs,
                    currentApp: store.currentApp,
                    currentSideBar: CurrentSideBar.DATA_SOURCE_SECTION

                });
            }
            case GlobalStoreActionType.SET_CURRENT_SELECTED_DATA_SOURCE: {
                return setStore({
                    currentSelectedDatasource: payload.pairs,
                    currentApp: store.currentApp,
                    idDataSourcePairs: store.idDataSourcePairs,
                    currentSideBar: store.currentSideBar
                });
            }
            default:
                return store;
        }
    }
    //RETURN USER TO THE MAIN SCREEN OF THE APP
    store.returnToMainScreen = function () {
        async function asyncLoadIdAppPairs() {
            const response = await api.getIdAppPairs();
            if (response.status == 200) {
                let pairs = response.data.apps;
                storeReducer({
                    type: GlobalStoreActionType.GO_TO_MAIN_SCREEN,
                    payload: { pairs: pairs }
                });
            }
            else {
                console.log("API FAILED TO GET THE APP PAIR");
            }
        }
        asyncLoadIdAppPairs();


    }
    //RESTORE EVERY STORE VALUE TO DEFAULT
    store.setStoreToDefault = function () {
        storeReducer({
            type: GlobalStoreActionType.DEFAULT_LOGIN_SCREEN,
            payload: null
        })
    }
    //LOAD ALL THE [{id,App}]
    store.loadIdAppPairs = function () {
        async function asyncLoadIdAppPairs() {
            const response = await api.getIdAppPairs();
            if (response.status == 200) {
                let pairs = response.data.apps;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_APP_LIST,
                    payload: { pairs: pairs }
                });
            }
            else {
                console.log("API FAILED TO GET THE APP PAIR");
            }
        }
        asyncLoadIdAppPairs();
    }
    //create default App and Datasource with all values null
    store.createDefaultApp = function () {
        async function asyncCreateDefaultApp() {
            let app = { name: "Untitle", datasources: [], views: [], roleM: " ", published: false };
            const response = await api.createApp(app);
            if (response.status == 200) {
                //create default datasource based on the app_id.{name:" ",datasources:[],views:[],roleM:" ",published:false}
                app._id = response.data.id;
                storeReducer({
                    type: GlobalStoreActionType.OPEN_APP,
                    payload: { app: app }
                })
            }
            else {
                console.log("API FAILED TO CREATE APP");
            }
        }
        asyncCreateDefaultApp();
    }

    //argument app has the format {name,creator,roleM, publish}
    store.editCurrentApp = function (app) {
        async function asyncEditCurrentApp() {
            const response = await api.updateApp(store.currentApp._id, app);
            if (response.status == 200) {
                console.log("APP UPDATE ALREADY");
                storeReducer({
                    type: GlobalStoreActionType.UPDATE_APP,
                    payload: { app: app }
                })
            }
            else {
                console.log("API FAIL TO UPDATE CURRENT APP");
            }
        }
        asyncEditCurrentApp();
    }
    store.loadIdDatasourcePair = function () {
        let pairs = [];
        let datasources = store.currentApp.datasources;
        for (let i = 0; i < datasources.length; i++) {
            pairs.push({ _id: datasources[i].id, name: datasources[i].name });
        }
        storeReducer({
            type: GlobalStoreActionType.LOAD_DATA_SOURCE_LIST,
            payload: { pairs: pairs }
        });

    }

    store.setCurrentSelectedDataSource = function (id) {
        async function asyncGetSelectedDataSource() {
            const response = await api.getDataSource(id);
            console.log(response);
            if (response.status == 200) {
                let ds = response.data.datasource;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_SELECTED_DATA_SOURCE,
                    payload: { pairs: ds }
                });
            }

        }
        asyncGetSelectedDataSource();
    }
    store.createNewColumn = function () {
        let value = store.currentSelectedDatasource;
        value.columns.push({name:"Untitled",label:false,reference:" ",type:" ",initValue:" "});
        storeReducer({
            type: GlobalStoreActionType.UPDATE_DATA_SOURCE,
            payload: { data_source: value, pairs: store.idDataSourcePairs }
        });
    }
    store.createNewDataSource = function () {
        async function asyncCreateNewDataSource() {
            console.log(store.currentApp._id);
            const response = await api.createNewDataSource({ name: "Untitle", URL: " ", sheetindex: 1, key: " ", columns: [], owner: store.currentApp._id });
            if (response.status == 200) {
                let value = store.idDataSourcePairs;
                value.push({ id: response.data.id, name: "Untitle" })
                storeReducer({
                    type: GlobalStoreActionType.LOAD_DATA_SOURCE_LIST,
                    payload: { pairs: value }
                });
            }
        }
        asyncCreateNewDataSource();
    }
    store.setCurrentSelectedColumnIndex = function (index) {
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_SELECTED_COLUMN,
            payload: { index: index }
        });
    }
    store.showModal = function (modal) {
        storeReducer({
            type: GlobalStoreActionType.SHOW_MODAL,
            payload: { modal: modal }
        });
    }

    store.hideModal = function () {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODAL
        })
    }

    store.updateColumn = async function (column) {
        let v = store.currentSelectedDatasource.columns.splice(store.currentSelectedColumnIndex, 1, column);
        const response = await api.getIdAppPairs();
        //await api.updateDataSource(v);
        if (response.data.success) {
            storeReducer({
                type: GlobalStoreActionType.UPDATE_DATA_SOURCE,
                payload: { data_source: store.currentDatasource, pairs: store.idDataSourcePairs }
            })
        }
    }

    //set the currentApp ==id, and also load the currentApp's i
    store.setCurrentApp = function (id) {
        async function asyncLoadCurrentApp() {
            const response = await api.getApp(id);
            if (response.status == 200) {
                let app = response.data.app;
                console.log(app);
                storeReducer({
                    type: GlobalStoreActionType.OPEN_APP,
                    payload: { app: app }
                });
            }
            else {
                console.log("API FAILED TO GET THE APP INFO BY ID");
            }
        }
        asyncLoadCurrentApp();
    }

    // store.changeSideBarSection = function (section) {
    //     storeReducer({
    //         type: GlobalStoreActionType.CHANGE_SIDEBAR_SECTION,
    //         payload: { section: section }
    //     })
    // }




    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };