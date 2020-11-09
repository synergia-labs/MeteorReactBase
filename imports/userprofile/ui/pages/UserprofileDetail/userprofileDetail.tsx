import React from 'react';
import {withTracker} from "meteor/react-meteor-data";
import {userprofileApi} from "../../../api/UserProfileApi";
import SimpleForm from "../../../../ui/components/SimpleForm/SimpleForm";
import _ from 'lodash';
import {Form,Container, Header,Button} from "semantic-ui-react";
import SimpleImageUploadBase64 from "../../../../ui/components/ImageUpload/SimpleImageUploadBase64";


const UserProfileDetail = ({screenState,loading,user,save,history}) => {

    const handleSubmit = (doc) => {
        // console.log('doc',doc)
        save(doc);
    }

    return (
        <Container text fluid>
            <Header as='h2'>{screenState==='view'?'Visualizar usuário':(screenState==='edit'?'Editar Usuário':'Criar usuário')}</Header>
            <SimpleForm
                mode={screenState}
                schema={userprofileApi.schema}
                doc={user}
                onSubmit={handleSubmit}
                loading={loading}

            >
                <Form.Group>
                <SimpleImageUploadBase64
                    label={'Foto'}
                    name={'photo'}
                />
                </Form.Group>
                <Form.Group>
                    <Form.Input
                        placeholder='Nome do Usuário'
                        name='username'
                    />
                    <Form.Input
                        placeholder='Email'
                        name='email'
                    />
                </Form.Group>
                <Form.Group>
                    <Button secondary type="button" content={screenState==='view'?'Voltar':'Cancelar'}
                                 onClick={screenState==='edit'?()=>history.push(`/userprofile/view/${user._id}`):()=>history.push(`/userprofile/list`)} />

                    {screenState==='view'?(
                        <Button primary type="button" content={'Editar'}
                                onClick={()=>history.push(`/userprofile/edit/${user._id}`)} />
                    ):null}
                    {screenState!=='view'?(
                        <Form.Button primary content={'Salvar'}/>
                    ):null}
                </Form.Group>
            </SimpleForm>
        </Container>
)
}

export const UserProfileDetailContainer = withTracker((props) => {
    const {screenState,id} = props;
    const subHandle = userprofileApi.subscribe('default',{_id:id});
    const user = subHandle.ready()?userprofileApi.findOne({_id:id}):{}

    return ({
        screenState,
        user,
        save:(doc)=>userprofileApi.update(doc,(e,r)=>{
            if(!e) {
                props.history.push(`/userprofile/view/${screenState==='create'?r:doc._id}`)
                props.showToast({
                    type:'success',
                    title:'Operação realizada!',
                    description: `O usuário foi ${doc._id?'atualizado':'cadastrado'} com sucesso!`,
                })
            } else {
                console.log('Error:',e);
                props.showToast({
                    type:'error',
                    title:'Operação não realizada!',
                    description: `Erro ao realizar a operação: ${e.message}`,
                })
            }

        }),
    })
})(UserProfileDetail)
