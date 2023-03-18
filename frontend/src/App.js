import './App.css';
import { React } from 'react';
import { useState,useEffect} from 'react';
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import AppBanner from './components/AppBanner';
import HomeScreen from './components/HomeScreen';
import axios from 'axios';




function App() {
  const [connecting, setConnecting] = useState(true);
  useEffect(()=>{
    try{
      const getLoggedIn = async () => {
        const response = await axios.get(`/auth/loggedIn`);
      console.log(response);
      if(response.data.loggedIn){
        setConnecting(false);
      }
      else{
        window.open('/auth/login','_self');
      }
      }
      getLoggedIn();
      
    }
    catch(error){
      console.log(error);
    }



  });
   return connecting?<div>Connecting</div>:
      <BrowserRouter>
      <AuthContextProvider>
          <GlobalStoreContextProvider>              
              <AppBanner />
              <HomeScreen/>
              <Routes>
              <Route exact component={HomeScreen} />
              </Routes>
          </GlobalStoreContextProvider>
      </AuthContextProvider>
  </BrowserRouter>;
}

export default App;
