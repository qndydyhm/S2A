import './App.css';
import { React } from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import AppBanner from './components/AppBanner';
import HomeScreen from './components/HomeScreen';
import axios from 'axios';




function App() {
  useEffect(() => {
    try {
      const getLoggedIn = async () => {
        const response = await axios.get(`/auth/loggedIn`);
        if (!response.data.loggedIn)
          window.open('/auth/login', '_self');
      }
      getLoggedIn();

    }
    catch (error) {
      console.log(error);
    }



  });
  return <BrowserRouter>
      <AuthContextProvider>
        <GlobalStoreContextProvider>
          <AppBanner />
          <HomeScreen />
          <Routes>
            <Route exact component={HomeScreen} />
          </Routes>
        </GlobalStoreContextProvider>
      </AuthContextProvider>
    </BrowserRouter>;
}

export default App;
