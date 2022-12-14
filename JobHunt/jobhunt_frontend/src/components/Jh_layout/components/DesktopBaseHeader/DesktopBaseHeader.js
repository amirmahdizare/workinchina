import React, { useEffect, useState } from 'react'
import { createTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import { DesktopViewHeaderMenus } from './components/HeaderMenus';
import Toolbar from '@material-ui/core/Toolbar';
import { Jh_Logo1 } from '../../../Jh_Logo1'
import { Jh_Logo2 } from '../../../Jh_Logo2'
import { Container } from '@material-ui/core';
import { SelectLanguage } from './components/SelectLanguage';
import { useLanguage } from '../../../../LanguageProvider/Dev/useLanguage';
const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
        [theme.breakpoints.up('md')]:
        {
            '& .MuiTypography-h6': {
                fontSize: '19px',
            },
        },
        [theme.breakpoints.down(1450)]:
        {
            '& .MuiTypography-h6': {
                fontSize: '13px',
            },
        }

    },
    appBar: {
        alignItems: 'center',
        transition: 'all .3s ease 0',
        top: '0px'
    },
    button: {
        color: 'inherit',
        textTransform: 'none',
        margin: '0 5px'
    },
    postJobButton: {
        borderRadius: '40px',
        border: '2px solid #fb236a',
        textTransform: 'none',
        boxSizing: 'border-box',
        transition: 'all 0.4s ease 0s',
        '&:hover': {
            backgroundColor: '#fb236a',
            color: 'white',
            boxShadow: 'none',
            transform: 'none',
            border: '2px solid #fb236a',
        },
    }
}));

const stickyHeaderTheme = createTheme({
    palette: {
        primary: {
            main: 'rgb(255,255,255)',
            contrastText: 'rgb(0,0,0)'
        },
    },
    typography: {
        fontFamily: 'Quicksand'
    }
});
const normalHeaderTheme = createTheme({
    palette: {
        primary: {
            main: 'rgba(0,0,0,0)',
            contrastText: '#fff',
        },
    },
    typography: {
        fontFamily: 'Quicksand'
    }
});
const DesktopBaseHeaderComponent = (props) => {
    const classes = useStyles();
    const [headerStatus, setheaderStatus] = useState("normal")
    const { language } = useLanguage()

    const checkStatus = () => () => {
        if (window.pageYOffset == 0) setheaderStatus("normal") 
        else setheaderStatus("sticky")
    }

    window.addEventListener('scroll', checkStatus())
    useEffect( checkStatus(), [language])

    return (
        <Box display={{ 'xs': 'none', 'lg': 'block' }} position={headerStatus == "normal" ? "absolute" : "sticky"} zIndex={10}>
            <ThemeProvider theme={headerStatus == "normal" ? normalHeaderTheme : stickyHeaderTheme} >
                <AppBar className={classes.appBar} style={headerStatus == "normal" ? { boxShadow: 'none' } : {}} >
                    <Container maxWidth="lg" style={{ position: 'relative' }}>
                        <Toolbar className={classes.toolbar}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" flex="1">
                                {headerStatus == "normal" ? <Jh_Logo1 /> : <Jh_Logo2 />}
                                <DesktopViewHeaderMenus headerStatus={headerStatus} />
                                <Box>{props.addItem}</Box>
                                <Box><SelectLanguage /></Box>
                                <Box>{props.userExtension}</Box>
                            </Box >
                        </Toolbar>
                    </Container>
                </AppBar>
            </ThemeProvider>
        </Box>
    )
}
export const DesktopBaseHeader = React.memo(DesktopBaseHeaderComponent)