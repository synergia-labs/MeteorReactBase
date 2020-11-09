import React from 'react';
import {withTracker} from "meteor/react-meteor-data";
import {exampleApi} from "../../api/exampleApi";
import SimpleForm from "../../../../ui/components/SimpleForm";
import SimpleImageUploadBase64 from "../../../../ui/components/ImageUpload/SimpleImageUploadBase64";
import _ from 'lodash';
import {Form,Container, Header,Button} from "semantic-ui-react";



const ExampleDetail = ({screenState,loading,exampler,save,history}) => {

    const handleSubmit = (doc) => {
        save(doc,(e,r)=>{
            if(!e) {
                history.push(`/example/view/${screenState==='create'?r:doc._id}`)
            } else {
                console.log('Error:',e)
            }

        });
    }

    return (
        <Container fluid>
            <Header as='h2'>{screenState==='view'?'Visualizar exemplo':(screenState==='edit'?'Editar Exemplo':'Criar exemplo')}</Header>
            <SimpleForm
                mode={screenState}
                schema={exampleApi.schema}
                doc={exampler}
                onSubmit={handleSubmit}
                loading={loading}

            >

                <SimpleImageUploadBase64
                    label={'Imagem'}
                    name={'image'}
                    />
                <Form.Group key={'fields'}>
                    <Form.Input
                        placeholder='Titulo'
                        name='title'
                    />
                    <Form.Input
                        placeholder='Descrição'
                        name='description'
                    />
                </Form.Group>
                <Form.Group key={'Buttons'}>
                    <Button content={screenState==='view'?'Voltar':'Cancelar'}
                            onClick={screenState==='edit'?()=>history.push(`/example/view/${exampler._id}`):()=>history.push(`/example/list`)}
                            secondary
                    />

                    {screenState==='view'?(
                        <Button content={'Editar'}
                                onClick={()=>history.push(`/example/edit/${exampler._id}`)}
                                primary

                        />
                    ):null}
                    {screenState!=='view'?(
                        <Form.Button content={'Salvar'} primary/>
                    ):null}
                </Form.Group>
            </SimpleForm>
        </Container>
)
}

export const ExampleDetailContainer = withTracker((props) => {
    const {screenState,id} = props;
    const subHandle = exampleApi.subscribe('default',{_id:id});
    const exampler = subHandle.ready()?exampleApi.findOne({_id:id}):{}

    return ({
        screenState,
        exampler,
        save:(doc,callback)=>exampleApi.upsert(doc,callback),
    })
})(ExampleDetail)
