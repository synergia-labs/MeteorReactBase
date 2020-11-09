import React from 'react';
import {withTracker} from "meteor/react-meteor-data";
import {exampleApi} from "../../api/exampleApi";
import SimpleTable from "../../../../ui/components/SimpleTable/SimpleTable";
import _ from 'lodash';
import {Button, Container, Header} from "semantic-ui-react";

const ExampleList = ({examples,history,remove,showDialog}) => {

    const onClick = (event,id,doc,showDialog) => {
        console.log(history)
        history.push('/example/view/'+id);
    }

    const callRemove=(doc)=>{
        const dialogOptions = {
            icon:'trash',
            title:'Remover exemplo',
            content:()=><p>{`Deseja remover o exemplo "${doc.title}"?`}</p>,
            actions:({closeDialog})=>[
                <Button
                    onClick={closeDialog}
                    secondary>{'Não'}</Button>,
                <Button onClick={()=>{
                    remove(doc);
                    closeDialog();
                    }}
                    primary>{'Sim'}</Button>,
            ]
        };
        showDialog(dialogOptions)
    }

    return (
        <Container text fluid>
            <Header as='h2'>{'Lista de Exemplos'}</Header>

            <SimpleTable
                schema={_.pick(exampleApi.schema,['image','title','description'])}
                data={examples}
                onClick={onClick}
                actions={[{icon:{name:'trash',color:'red'},onClick:callRemove}]}
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
        remove:(doc)=>{
            exampleApi.remove(doc,(e,r)=>{
                if(!e) {
                    props.showToast({
                        type:'success',
                        title:'Operação realizada!',
                        description: `O exemplo foi removido com sucesso!`,
                    })
                } else {
                    console.log('Error:',e);
                    props.showToast({
                        type:'error',
                        title:'Operação não realizada!',
                        description: `Erro ao realizar a operação: ${e.message}`,
                    })
                }

            })
        }
    })
})(ExampleList)
