import { Box, Container, Grid, Typography, makeStyles, CircularProgress } from '@material-ui/core'
import React from 'react'
import PartnerSlider from './components/PartnerSlider.js'
const useClasses = makeStyles((theme) => ({
    root: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        margin: theme.spacing(1),
    }
}))
const Partners = () => {
    const classes = useClasses()
    return (
        <Box>
            <Container maxWidth="lg" className={classes.root}>

                <Box m={4} textAlign="center">
                    <Typography variant="h4" gutterBottom>Companies We've Helped</Typography>
                    <Typography color="textSecondary">What other people thought about the service provided by JobHunt</Typography>
                </Box>
                <PartnerSlider />
            </Container>

        </Box>
    )
}
export { Partners }