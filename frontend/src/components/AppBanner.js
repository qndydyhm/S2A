import { useEffect } from "react";
import { useContext, useState } from 'react';
import AuthContext from '../auth';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Star from '@mui/icons-material/Star';


export default function AppBanner() {
    const { auth } = useContext(AuthContext);
    // const [user, setUser] = useState(auth.user);
    // useEffect(()=>{
    //     auth.getLogIn();
    // });
    function handleGoToMainScreen(){
        console.log("GO TO MAIN SCREEN");
        // store.returnToMainScreen();
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" style={{ background: '#2E3B55' }}>
                <Toolbar>
                    <Typography
                        variant="h4"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        S2A
                        <IconButton onClick={handleGoToMainScreen}  color="inherit"><Star ></Star></IconButton>
                    </Typography>
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {auth.user}
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );

}