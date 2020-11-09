import React from 'react'
import {
    Container,
    Divider,
    Dropdown,
    Grid,
    Header,
    Image,
    List,
    Menu,
    Segment,
} from 'semantic-ui-react'
import { BrowserRouter as Router} from 'react-router-dom'
import AppNavBar from "./AppNavBar";
import AppRouterSwitch from "./AppRouterSwitch";

const FixedMenuLayout = (props) => (
    <Router>
        <Menu fixed='top' borderless stackable>
            <Container fluid>
                <Image size='mini' src='/images/wireframe/logo.png' />
                <AppNavBar {...props} />
            </Container>
        </Menu>
        <Container style={{ marginTop: '5em',padding:4 }} fluid>
        <AppRouterSwitch {...props} />
        </Container>
    </Router>
)

export default FixedMenuLayout