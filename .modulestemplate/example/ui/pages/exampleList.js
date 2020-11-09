import React from 'react';
import {withTracker} from "meteor/react-meteor-data";
import {exampleApi} from "../../api/exampleApi";
import SimpleTable from "../../../../ui/components/SimpleTable";
import _ from 'lodash';
import {Button, Container, Header} from "semantic-ui-react";

const ExampleList = ({examples,history}) => {

    const onClick = (event,id,doc) => {
        history.push('/example/view/'+id);
    }

    return (
        <Container fluid>
            <Header as='h2'>{'Lista de Exemplos'}</Header>

            <SimpleTable
                schema={_.pick(exampleApi.schema,['image','title','description'])}
                data={examples}
                onClick={onClick}
            />
            <div style={{position:'absolute',bottom:30,right:30}}>
                <Button
                    onClick={()=>history.push('/example/create')}
                    circular
                    icon='add'
                    size={'big'}
                    primary/>
            </div>
        </Container>
        )

}

export const ExampleListContainer = withTracker((props) => {
    const subHandle = exampleApi.subscribe('default',{});
    const examples = subHandle.ready()?exampleApi.find({}).fetch():[]

    return ({
        examples,
    })
})(ExampleList)
