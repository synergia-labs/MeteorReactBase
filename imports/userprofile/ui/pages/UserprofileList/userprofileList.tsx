import React from 'react';
import {withTracker} from "meteor/react-meteor-data";
import {userprofileApi} from "../../../api/UserProfileApi";
import SimpleTable from "../../../../ui/components/SimpleTable/SimpleTable";
import _ from 'lodash';
import {Button, Container, Header} from "semantic-ui-react";
import {exampleApi} from "../../../../modules/example/api/exampleApi";

const UserProfileList = ({users,history}) => {

    const onClick = (event,id,doc) => {
        history.push('/userprofile/view/'+id);
    }

    return (
        <Container text fluid>
            <Header as='h2'>{'Lista de Usuários'}</Header>
            <SimpleTable
                schema={_.pick(userprofileApi.schema,['photo','username','email'])}
                data={users}
                onClick={onClick}
            />
        </Container>
    );
}

export const UserProfileListContainer = withTracker((props) => {
    const subHandle = userprofileApi.subscribe('default',{});
    const users = subHandle.ready()?userprofileApi.find({}).fetch():[]

    return ({
        users,
    })
})(UserProfileList)
