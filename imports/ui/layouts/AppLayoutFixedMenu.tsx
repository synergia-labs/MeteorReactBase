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
import { BrowserRouter as Router,withRouter, NavLink } from 'react-router-dom'
import AppNavBar from "./AppNavBar";
import AppRouterSwitch from "./AppRouterSwitch";
import {isMobile} from '../../libs/deviceVerify'

const HomeIconButton = withRouter((props)=>{
    return <NavLink to={'/'}><div style={{
        width:60,height:40,display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
        <Image style={{maxHeight:45}} src='/images/wireframe/logo.png' />
    </div></NavLink>
})

const FixedMenuLayout = (props) => (
    <Router>
        <Menu fixed='top' borderless>
            <Container style={{display:'flex',flexDirection:'row'}} fluid>
                <HomeIconButton />
                <AppNavBar {...props} />
            </Container>
        </Menu>
        <div style={{ width:'100%',display:'flex',flexDirection:'column',alignItems:'center',margin:0,marginTop: '5em',padding:4 }}>
            <AppRouterSwitch {...props} />
        </div>
    </Router>
)

export default FixedMenuLayout