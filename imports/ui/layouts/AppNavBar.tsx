import React from 'react'
import PropTypes from 'prop-types'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { withRouter, NavLink } from 'react-router-dom'
import { Menu, Dropdown } from 'semantic-ui-react'
import Modules from '../../modules';
import {userprofileApi} from "../../userprofile/api/UserProfileApi";
import {isMobile} from "/imports/libs/deviceVerify";


const AppNavBar = ({ currentUser }) => {

    return (
        <>
            {
                (Modules.getAppMenuItemList() || []).map(menuData=>{
                    return (
                        <Menu.Item
                            key={menuData.path}
                            as={NavLink} to={menuData.path}
                            name={menuData.name}
                            activeClassName={'active'}
                        >
                            {menuData.icon?menuData.icon:null}
                            {isMobile?'':menuData.name}
                        </Menu.Item>
                    )

                })
            }
            <Menu.Item position="right">
                {!currentUser||!currentUser._id? (
                    <Dropdown text="Fazer login" pointing="top right" icon="user">
                        <Dropdown.Menu>
                            <Dropdown.Item icon="user" text="Entrar" as={NavLink} exact to="/signin" />
                            <Dropdown.Item icon="add user" text="Cadastrar-se" as={NavLink} exact to="/signup" />
                        </Dropdown.Menu>
                    </Dropdown>
                ) : (
                    <Dropdown text={currentUser.username||(currentUser.profile?(currentUser.profile.name||currentUser.profile.username||'-'):'')} pointing="top right" icon="user">
                        <Dropdown.Menu>
                            <Dropdown.Item icon="user" text="Meus dados" as={NavLink} exact to={`/userprofile/view/${currentUser._id}`} />
                            <Dropdown.Item icon="sign out" text="Sair" as={NavLink} exact to="/signout" />
                        </Dropdown.Menu>
                    </Dropdown>
                )}
            </Menu.Item>
        </>
    )
}

AppNavBar.propTypes = { currentUser: PropTypes.object }
AppNavBar.defaultProps = { currentUser: null }

// withRouter HOC.
// see explanation: https://reacttraining.com/react-router/web/api/withRouter

const AppNavBarContainer = withTracker((props) => {

    const subHandle = userprofileApi.subscribe('getLoggedUserProfile')
    const MeteorUser = Meteor.user();
    const currentUser = subHandle.ready()?(userprofileApi.findOne({email:MeteorUser?MeteorUser.profile.email:'NoUser'})):(MeteorUser||null)

    return(
        {
            currentUser,
        }
        )
})(AppNavBar)

export default withRouter(AppNavBarContainer)

