import React from 'react'
import {
    Container,
    Image,
    Menu,
} from 'semantic-ui-react'
import { BrowserRouter as Router,withRouter, NavLink } from 'react-router-dom'
import AppNavBar from "./AppNavBar";
import AppRouterSwitch from "./AppRouterSwitch";

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
        <div style={{
            display:'flex',flexDirection:'column',alignItems:'center',
            overflowY:'auto',
            width:'100%',height:'calc(100% - 47px)',margin:0,marginTop: 47,padding:4 }}>
            <AppRouterSwitch {...props} />
        </div>
    </Router>
)

export default FixedMenuLayout