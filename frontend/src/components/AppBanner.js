import { useEffect,useContext,useState } from "react";
import AuthContext from '../auth';
import { IconButton, Toolbar, Typography, Avatar, Box, AppBar ,Menu,MenuItem} from '@mui/material/';
import Star from '@mui/icons-material/Star';
import GlobalStoreContext from '../store';
import axios from "axios";




export default function AppBanner() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const menuId = 'primary-search-account-menu';
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const loggedInMenu =
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>

    function handleGoToMainScreen() {
        store.returnToMainScreen();
    }
    function handleLogout() {
        axios.get("/auth/logout").then(()=>{window.open("/auth/login","_self")});
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
                        <IconButton onClick={handleGoToMainScreen} color="inherit"><Star ></Star></IconButton>
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}></Box>
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {auth.user}
                    </Box>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                    >
                        <Avatar
                            src={auth.profile}
                        />
                    </IconButton>
                </Toolbar>
            </AppBar>
            {
                loggedInMenu
            }
        </Box>
    );

}