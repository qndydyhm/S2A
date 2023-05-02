import { Alert } from '@mui/material';
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
    SET_CURRENT_SELECTED_VIEW: "SET_CURRENT_SELECTED_VIEW",
    SET_TABLE_FOR_VIEW: "SET_TABLE_FOR_VIEW",

    //End User Section
    SET_TABLE_DATA: "SET_TABLE_DATA",
    LOAD_TABLE_VIEW_LIST: "LOAD_TABLE_VIEW_LIST",
    LOAD_DETAIL_VIEW: "LOAD_DETAIL_VIEW",

    //Modal
    ON_EDIT_RECORD: "ON_EDIT_RECORD",
    ON_ADD_RECORD:"ON_ADD_RECORD",
    LOAD_THE_PAGE:"LOAD_THE_PAGE"

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
    DATA_SOURCE_SECTION: "DATA_SOURCE_SECTION"
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
        //view
        viewPairs: [],//[{id,name}....]
        currentSelectedViewId: null,//the id of selected view,
        currentTableForView: null, //the table associated with current selected view
        //table view
        startApp: false,
        idTableViewPairs: [],
        currentSelectedTableData: null,
        currentSelectedDetailData: null,
        editRecord: false,
        onAddRecord:false,
        loadThePage:false
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
                    startApp: false,
                });
            }
            case GlobalStoreActionType.GO_TO_MAIN_SCREEN: {
                return setStore({
                    idAppPairs: payload.pairs,
                    currentApp: null,
                    startApp: false
                });
            }
            case GlobalStoreActionType.LOAD_APP_LIST: {
                return setStore({
                    idAppPairs: payload.pairs,
                    currentApp: store.currentApp,
                    idDataSourcePairs: store.idDataSourcePairs,
                    startApp: store.startApp
                });
            }
            case GlobalStoreActionType.UPDATE_APP: {
                return setStore({
                    currentApp: payload.app,
                    currentSideBar: CurrentSideBar.APP_INFO_SECTION,
                    startApp: store.startApp
                });
            }
            case GlobalStoreActionType.UPDATE_DATA_SOURCE: {
                return setStore({
                    currentSelectedDatasource: payload.data_source,
                    idDataSourcePairs: payload.pairs,
                    currentSideBar: store.currentSideBar,
                    currentApp: payload.app,
                    startApp: store.startApp

                });
            }
            case GlobalStoreActionType.LOAD_VIEW_LIST: {
                return setStore({
                    viewPairs: payload.pairs,
                    currentApp: payload.app,
                    currentSideBar: CurrentSideBar.VIEW_SECTION,
                    startApp: store.startApp
                });
            }
            case GlobalStoreActionType.OPEN_APP: {
                return setStore({
                    currentApp: payload.app,
                    currentSideBar: CurrentSideBar.APP_INFO_SECTION,
                    startApp: false

                });
            }

            case GlobalStoreActionType.SET_CURRENT_SELECTED_COLUMN_INDEX: {
                return setStore({
                    currentSelectedColumnIndex: payload.index,
                    startApp: store.startApp
                });
            }

            case GlobalStoreActionType.LOAD_DATA_SOURCE_LIST: {
                return setStore({
                    idDataSourcePairs: payload.pairs,
                    currentApp: payload.app,
                    currentSideBar: CurrentSideBar.DATA_SOURCE_SECTION,
                    startApp: store.startApp


                });
            }
            case GlobalStoreActionType.SET_CURRENT_SELECTED_DATA_SOURCE: {
                return setStore({
                    currentSelectedDatasource: payload.pairs,
                    currentApp: store.currentApp,
                    idDataSourcePairs: store.idDataSourcePairs,
                    currentSideBar: store.currentSideBar,
                    startApp: store.startApp
                });
            }
            case GlobalStoreActionType.SET_CURRENT_SELECTED_VIEW: {
                return setStore({
                    currentSelectedView: payload.v,
                    currentApp: store.currentApp,
                    idDataSourcePairs: store.idDataSourcePairs,
                    currentSideBar: store.currentSideBar,
                    viewPairs: store.viewPairs,
                    startApp: store.startApp
                });
            }
            case GlobalStoreActionType.SET_TABLE_FOR_VIEW: {
                return setStore({
                    currentSelectedView: store.currentSelectedView,
                    currentApp: store.currentApp,
                    currentSideBar: store.currentSideBar,
                    currentTableForView: payload.t,
                    viewPairs: store.viewPairs,
                    startApp: store.startApp
                });
            }
            case GlobalStoreActionType.UPDATE_VIEW: {
                return setStore({
                    currentSelectedView: payload.view,
                    currentApp: payload.app,
                    idDataSourcePairs: store.idDataSourcePairs,
                    currentSideBar: store.currentSideBar,
                    viewPairs: store.viewPairs,
                    startApp: store.startApp,
                    editRecord: store.editRecord,
                    OnAddRecord:false
                });
            }
            case GlobalStoreActionType.SET_TABLE_DATA: {
                return setStore({
                    currentSelectedTableData: payload.table,
                    currentSelectedDetailData: null,
                    currentApp: store.currentApp,
                    idAppPairs: store.idAppPairs,
                    idTableViewPairs: store.idTableViewPairs,
                    startApp: true,
                    editRecord: false,
                    onAddRecord:false

                });
            }
            case GlobalStoreActionType.LOAD_TABLE_VIEW_LIST: {
                return setStore({
                    currentSelectedTableData: null,
                    idTableViewPairs: payload.pairs,
                    currentApp: payload.id,
                    startApp: true,
                    currentSelectedDetailData: null,
                    editRecord: false,
                    onAddRecord:false,
                    loadThePage:false
                });
            }
            case GlobalStoreActionType.LOAD_DETAIL_VIEW: {
                return setStore({
                    currentSelectedTableData: store.currentSelectedTableData,
                    currentSelectedDetailData: payload.table,
                    idAppPairs: store.idAppPairs,
                    idTableViewPairs: store.idTableViewPairs,
                    currentApp: store.currentApp,
                    startApp: true,
                    editRecord: store.editRecord,
                    onAddRecord:false,
                    loadThePage:false
                });
            }
            case GlobalStoreActionType.ON_EDIT_RECORD: {
                return setStore({
                    currentSelectedTableData: store.currentSelectedTableData,
                    currentSelectedDetailData: store.currentSelectedDetailData,
                    idAppPairs: store.idAppPairs,
                    idTableViewPairs: store.idTableViewPairs,
                    currentApp: store.currentApp,
                    startApp: true,
                    editRecord: true,
                    onAddRecord:false,
                    loadThePage:false
                });
            }
            case GlobalStoreActionType.LOAD_THE_PAGE:{
                setStore({
                    currentSelectedTableData: store.currentSelectedTableData,
                    currentSelectedDetailData: store.currentSelectedDetailData,
                    idAppPairs: store.idAppPairs,
                    idTableViewPairs: store.idTableViewPairs,
                    currentApp: store.currentApp,
                    startApp: true,
                    editRecord: true,
                    loadThePage:true
                });
            }
            case GlobalStoreActionType.ON_ADD_RECORD:{
                setStore({
                    currentSelectedTableData: store.currentSelectedTableData,
                    currentSelectedDetailData: store.currentSelectedDetailData,
                    idAppPairs: store.idAppPairs,
                    idTableViewPairs: store.idTableViewPairs,
                    currentApp: store.currentApp,
                    startApp: true,
                    editRecord: false,
                    onAddRecord:true,
                    loadThePage:false
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
        asyncLoadIdAppPairs().catch(e => alert(e.response.data.status));


    }

    store.isGlobalDeveloper = function () {
        async function asyncIsGlobalDeveloper() {
            const response = await api.isGlobalDeveloper();
            if (response.status == 200) {
                return response.data.isGlobalDeveloper;
            }
            else {
                console.log("FAIL TO CHECK GLOBAL DEVELOPER");
            }
        }
        asyncIsGlobalDeveloper().catch(e => alert(e.response.data.status));
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
        asyncLoadIdAppPairs().catch(e => alert(e.response.data.status));
    }
    //create default App and Datasource with all values null
    store.createDefaultApp = function () {
        async function asyncCreateDefaultApp() {
            let app = { name: "Untitle", datasources: [], views: [], roleM: "https://docs.google.com/spreadsheets/d/19XvlQOUIHjHCckc5dpP1GzdFEjZL4O3bIKS-XrSN8n8/edit#gid=0", published: false };
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
                Alert(response.data.status);
            }
        }
        asyncCreateDefaultApp().catch(e => alert(e.response.data.status));
    }

    store.deleteApp = function (id) {
        async function asyncDeleteApp() {
            const response = await api.deleteApp(id);
            if (response.status === 200) {
                const response1 = await api.getIdAppPairs();
                if (response1.status === 200) {
                    let pairs = response1.data.apps;
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_APP_LIST,
                        payload: { pairs: pairs }
                    });
                }
                else {
                    console.log("API FAILED TO GET THE APP PAIR");
                }
            }
            else {
                console.log("API FAILED TO DELETE THE APP PAIR");

            }
        }
        asyncDeleteApp().catch(e => alert(e.response.data.status));
    }

    //argument app has the format {name,creator,roleM, publish}
    store.editCurrentApp = function (app) {
        async function asyncEditCurrentApp() {
            try {
                const response = await api.updateApp(store.currentApp._id, app);
                if (response.status == 200) {
                    storeReducer({
                        type: GlobalStoreActionType.UPDATE_APP,
                        payload: { app: app }
                    })
                }
            }
            catch (error) {
                alert(error.response.data.status);
            }
        }
        asyncEditCurrentApp().catch(e => alert(e.response.data.status));
    }
    store.loadIdDatasourcePair = function () {
        let pairs = [];
        let datasources = store.currentApp.datasources;
        for (let i = 0; i < datasources.length; i++) {
            pairs.push({ _id: datasources[i].id, name: datasources[i].name });
        }
        storeReducer({
            type: GlobalStoreActionType.LOAD_DATA_SOURCE_LIST,
            payload: { pairs: pairs, app: store.currentApp }
        });

    }
    store.deleteDataSource = function (id) {
        try {
            async function deleteDataSource() {
                const response = await api.deleteDataSource(id);
                if (response.status === 200) {
                    for (let i = 0; i < store.idDataSourcePairs.length; i++) {
                        if (store.idDataSourcePairs[i]._id == id) {
                            store.idDataSourcePairs.splice(i, 1);
                            break;
                        }
                    }
                    const response1 = await api.getApp(store.currentApp._id);
                    if (response1.status == 200) {
                        storeReducer({
                            type: GlobalStoreActionType.LOAD_DATA_SOURCE_LIST,
                            payload: { pairs: store.idDataSourcePairs, app: response1.data.app }
                        });

                    }

                }
                else {
                    console.log("UNABLE TO DELETE DATA SOURCE");
                }
            }
            deleteDataSource();
        }
        catch (error) {
            alert(error.response.data.status);
        }
    }

    store.setCurrentSelectedDataSource = function (id) {
        async function asyncGetSelectedDataSource() {
            const response = await api.getDataSource(id);
            if (response.status == 200) {
                let ds = response.data.datasource;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_SELECTED_DATA_SOURCE,
                    payload: { pairs: ds }
                });
            }

        }
        asyncGetSelectedDataSource().catch(e => alert(e.response.data.status));
    }
    store.createNewColumn = function () {
        let value = store.currentSelectedDatasource;
        value.columns.push({ name: "Untitled", reference: " ", type: "Boolean", initvalue: " " });
        storeReducer({
            type: GlobalStoreActionType.UPDATE_DATA_SOURCE,
            payload: { data_source: value, pairs: store.idDataSourcePairs, app: store.currentApp }
        });
    }

    store.updateColumn = function (columns) {
        let value = store.currentSelectedDatasource;
        value.columns = columns;
        console.log(value.columns);
        storeReducer({
            type: GlobalStoreActionType.UPDATE_DATA_SOURCE,
            payload: { data_source: value, pairs: store.idDataSourcePairs, app: store.currentApp }
        });
    }
    store.updateDataSourceLocally = function (datasource) {
        storeReducer({
            type: GlobalStoreActionType.UPDATE_DATA_SOURCE,
            payload: { data_source: datasource, pairs: store.idDataSourcePairs, app: store.currentApp }
        });
    }
    store.createNewDataSource = function () {
        try {
            async function asyncCreateNewDataSource() {
                const response = await api.createNewDataSource({ name: "Untitle", URL: "https://docs.google.com/spreadsheets/d/1yCajMCD1cYrDAl-Fki3sMunpDoVtX7n0U7pCXivjm_Y/edit#gid=0", key: "Untitle", columns: [{ name: "Untitle", reference: " ", type: "Boolean", initvalue: " " }], owner: store.currentApp._id });
                if (response.status == 200) {
                    let value = store.idDataSourcePairs;
                    value.push({ _id: response.data.id, name: "Untitle" })
                    const response1 = await api.getApp(store.currentApp._id);
                    if (response1.status == 200) {
                        storeReducer({
                            type: GlobalStoreActionType.LOAD_DATA_SOURCE_LIST,
                            payload: { pairs: value, app: response1.data.app }
                        });
                    }
                    else {
                        console.log("FAIL TO GET APP");
                    }
                }
            }
            asyncCreateNewDataSource().catch(e => alert(e.response.data.status));
        }
        catch (error) {
            alert(error.response.data.status);
        }
    }
    store.confirmEditDataSource = function () {
        async function asyncEditDataSource() {
            try {
                let flag = store.currentSelectedDatasource.label == undefined || store.currentSelectedDatasource.label == "";
                for (let i = 0; i < store.currentSelectedDatasource.columns.length; i++) {
                    if (store.currentSelectedDatasource.columns[i].name == store.currentSelectedDatasource.label) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    store.currentSelectedDatasource.label = undefined;
                    alert("The label name you enter doesn't exist");
                }
                const response = await api.updateDataSource(store.currentSelectedDatasource._id, store.currentSelectedDatasource);
                if (response.status == 200) {
                    for (let i = 0; i < store.idDataSourcePairs.length; i++) {
                        if (store.idDataSourcePairs[i]._id == store.currentSelectedDatasource._id) {
                            store.idDataSourcePairs[i].name = store.currentSelectedDatasource.name;
                            break;
                        }
                    }
                    const response1 = await api.getApp(store.currentApp._id);
                    if (response1.status == 200) {
                        storeReducer({
                            type: GlobalStoreActionType.UPDATE_DATA_SOURCE,
                            payload: { data_source: store.currentSelectedDatasource, pairs: store.idDataSourcePairs, app: response1.data.app }
                        });
                    }
                }
            }
            catch (error) {
                alert(error.response.data.status);
            }

        }
        asyncEditDataSource();

    }
    store.setCurrentSelectedColumnIndex = function (index) {
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_SELECTED_COLUMN,
            payload: { index: index }
        });
    }
    //set the currentApp ==id, and also load the currentApp's i
    store.setCurrentApp = function (id) {
        async function asyncLoadCurrentApp() {
            const response = await api.getApp(id);
            if (response.status == 200) {
                let app = response.data.app;
                storeReducer({
                    type: GlobalStoreActionType.OPEN_APP,
                    payload: { app: app }
                });
            }
            else {
                console.log("API FAILED TO GET THE APP INFO BY ID");
            }
        }
        asyncLoadCurrentApp().catch(e => alert(e.response.data.status));
    }


    //Views
    store.createNewView = function () {
        try {
            async function asyncCreateNewView() {
                const response = await api.createNewView({ name: "Untitled", table: " ", columns: [], viewtype: "table", allowedactions: 0, roles: [], owner: store.currentApp._id });
                if (response.status == 200) {
                    let value = store.viewPairs;
                    value.push({ _id: response.data.id, name: "Untitled" });
                    const response1 = await api.getApp(store.currentApp._id);
                    if (response1.status == 200) {
                        storeReducer({
                            type: GlobalStoreActionType.LOAD_VIEW_LIST,
                            payload: { pairs: value, app: response1.data.app }
                        });
                    } else {
                        console.log("FAIL TO GET APP");
                    }
                }
            }
            asyncCreateNewView();
        } catch (e) {
            alert(e.response.data.status);
        }

    }
    store.loadViewPair = function () {
        let pairs = [];
        let views = store.currentApp.views;
        for (let i = 0; i < views.length; i++) {
            pairs.push({ _id: views[i].id, name: views[i].name });
        }
        storeReducer({
            type: GlobalStoreActionType.LOAD_VIEW_LIST,
            payload: { pairs: pairs, app: store.currentApp }
        });
    }

    store.setCurrentSelectedView = function (id) {
        async function asyncGetSelectedView() {
            const response = await api.getView(id);
            if (response.status = 200) {
                let v = response.data.view;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_SELECTED_VIEW,
                    payload: { v: v }
                });
            }
        }
        asyncGetSelectedView().catch(e => alert(e.response.data.status));
    }
    store.setTableForView = function (id) {
        async function asyncSetTableForView() {
            const response = await api.getDataSource(id);
            if (response.status = 200) {
                let t = response.data.datasource;
                storeReducer({
                    type: GlobalStoreActionType.SET_TABLE_FOR_VIEW,
                    payload: { t: t }
                });
            }
        }
        asyncSetTableForView().catch(e => alert(e.response.data.status));
    }
    store.editCurrentView = function (id, view) {
        async function asyncEditCurrentView() {
            try {
                const response = await api.updateView(id, view);
                if (response.status == 200) {
                    for (let i = 0; i < store.viewPairs.length; i++) {
                        if (store.viewPairs[i]._id == view._id) {
                            store.viewPairs[i].name = view.name;
                            break;
                        }
                    }
                    const response1 = await api.getApp(store.currentApp._id);
                    if (response1.status == 200) {
                        storeReducer({
                            type: GlobalStoreActionType.UPDATE_VIEW,
                            payload: { view: view, app: response1.data.app }
                        });
                    }
                }
                else {
                    console.log("API FAIL TO UPDATE CURRENT VIEW");
                }
            } catch (e) {
                alert(e.response.data.status);
            }
        }
        asyncEditCurrentView();
    }
    store.deleteView = function (id) {
        try {
            async function asyncDeleteView() {
                const response = await api.deleteView(id);
                if (response.status = 200) {
                    for (let i = 0; i < store.viewPairs.length; i++) {
                        if (store.viewPairs[i]._id == id) {
                            store.viewPairs.splice(i, 1);
                            break;
                        }
                    }
                    const response1 = await api.getApp(store.currentApp._id);
                    if (response1.status == 200) {
                        storeReducer({
                            type: GlobalStoreActionType.LOAD_VIEW_LIST,
                            payload: { pairs: store.viewPairs, app: response1.data.app }
                        });
                    }

                }
                else {
                    console.log("UNABLE TO DELETE VIEW");
                }
            }
            asyncDeleteView();
        }
        catch (e) {
            alert(e.response.data.status);
        }
    }

    store.setCurrentSelectedTableViewCard = (id) => {
        async function asyncgetTableData() {
            const response = await api.getTableData(id);
            if (response.status == 200) {
                storeReducer({
                    type: GlobalStoreActionType.SET_TABLE_DATA,
                    payload: { table: response.data }
                });
            }
            else {
                console.log("API FAIL TO FETCH TABLE DATA");
            }
        }
        asyncgetTableData().catch(e => alert(e.response.data.status));
    }
    store.startCurrentApp = (id) => {
        async function asyncLoadIdTableViewPairs() {
            const response = await api.getIdTableViewPairs(id);
            if (response.status == 200) {
                let pairs = response.data.views;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_TABLE_VIEW_LIST,
                    payload: { pairs: pairs, id: id }
                });
            }
            else {
                console.log("API FAILED TO GET THE APP PAIR");
            }
        }
        asyncLoadIdTableViewPairs().catch(e => alert(e.response.data.status));
    }

    store.loadDetailView = (id, key) => {
        // change the current detailView
        async function asyncGetDetailView() {
            const response = await api.getDetailView(id, key);
            if (response.status == 200) {
                let data = response.data;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_DETAIL_VIEW,
                    payload: { table: response.data }
                });
            }
            else {
                console.log("API FAILED TO GET THE APP PAIR");
            }
        }
        asyncGetDetailView();

    }
    store.deleteRecord = (key) => {
        try {
            async function asyncDeleteRecord() {
                const response = await api.deleteReocrd(store.currentSelectedTableData.id,key);
                if (response.status === 200) {
                    const response1 = await api.getTableData(store.currentSelectedTableData.id);
                    if (response1.status == 200) {
                        storeReducer({
                            type: GlobalStoreActionType.SET_TABLE_DATA,
                            payload: { table: response1.data }
                        });
                    }
                    else {
                        console.log("API FAIL TO FETCH TABLE DATA");
                    }

                }
                else {
                    console.log("UNABLE TO DELETE DATA SOURCE");
                }
            }
            asyncDeleteRecord();
        }
        catch (error) {
            alert(error.response.data.status);
        }

    }
    store.closeDetailView = () => {
        storeReducer({
            type: GlobalStoreActionType.SET_TABLE_DATA,
            payload: { table: store.currentSelectedTableData }
        });

    }
    store.openEditRecord = () => {
        storeReducer({
            type: GlobalStoreActionType.ON_EDIT_RECORD
        })
    }
    store.updateRecordLocally = (table) => {
        storeReducer({
            type: GlobalStoreActionType.LOAD_DETAIL_VIEW,
            payload: { table: table }
        });
    }
    store.addNewRecord = (key) => {
        console.log(store.currentSelectedTableData)
        async function asyncAddNewRecord() {
            try {
                const response = await api.updateRecord(store.currentSelectedTableData.id, key, {});
                if(response.status == 200){
                    const response1 = await api.getTableData(store.currentSelectedTableData.id);
                    if (response1.status == 200) {
                        console.log(response1);
                        storeReducer({
                            type: GlobalStoreActionType.SET_TABLE_DATA,
                            payload: { table: response1.data }
                        })
                    }
                }
            }catch(e){
                alert(e.response.data.status);
            }
        }
        asyncAddNewRecord();
    }
    store.updateRecord = (table) => {
        async function asyncEditCurrentView() {
            try {
                let t = {};
                for (let i = 0; i < table.columns.length; i++) {
                    t[table.columns[i]] = table.data[0][i];
                }
                const response = await api.updateRecord(table.id, table.keys[0], t);
                if (response.status == 200) {
                    const response1 = await api.getTableData(store.currentSelectedTableData.id);
                    if (response1.status == 200) {
                        storeReducer({
                            type: GlobalStoreActionType.SET_TABLE_DATA,
                            payload: { table: response1.data }
                        })

                    }
                }
            }
            catch (error) {
                console.log(error);
                alert(error);
            }
        }
        asyncEditCurrentView();
    }
    store.openAddRecord=()=>{
        storeReducer({
            type: GlobalStoreActionType.ON_ADD_RECORD,
        })
    }

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