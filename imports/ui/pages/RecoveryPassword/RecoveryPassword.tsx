// login page overrides the form’s submit event and call Meteor’s loginWithPassword()
// Authentication errors modify the component’s state to be displayed
import React from 'react'
import PropTypes from 'prop-types'
import { Meteor } from 'meteor/meteor'
import { Container, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import SimpleForm from "/imports/ui/components/SimpleForm/SimpleForm";

export default class RecoveryPassword extends React.Component {
  onSubmit = doc => {
    const {email} = doc;
    const props = this.props;

    Accounts.forgotPassword({email}, (err, res) => {

      if (err) {
        if (err.message === 'User not found [403]') {
          this.props.showToast({
            type:'error',
            title:'Problema na recuperação da senha!',
            description: 'Este email não está cadastrado em nossa base de dados!',
          });
        } else {
          this.props.showToast({
            type:'error',
            title:'Problema na recuperação da senha!',
            description: 'Erro ao recriar a senha, faça contato com o administrador!!',
          });
        }
      } else {
        this.props.showToast({
          type:'sucess',
          title:'Senha enviada!',
          description: 'Acesse seu email e clique no link para criar uma nova senha.',
        });
        props.history.push('/');
      }
    });
  };


  render() {
    const self = this;
    const { location } = this.props
    const { from } = location.state || { from: { pathname: '/' } }
        return (
      <Container>
        <Grid textAlign="center" verticalAlign="middle" centered columns={2}>
          <Grid.Column>
            <Header as="h2" textAlign="center">
              <Image src="/images/wireframe/logo.png" /> {'Acessar o sistema'}
            </Header>
            <SimpleForm
                schema={{
                  email:{type:'String',label:'Email',optional:false},
                }}

                onSubmit={this.onSubmit}>
              <Segment stacked>
                <Form.Input
                  label="Email"
                  icon="user"
                  iconPosition="left"
                  name="email"
                  type="email"
                  placeholder="Digite seu email"

                />
                <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                  <a onClick={()=>this.props.history.push('/signin')} style={{cursor:'pointer',width:180}}>{'Voltar'}</a>
                  <Form.Button content="Recuperar a senha" />
                </div>

              </Segment>
            </SimpleForm>

          </Grid.Column>
        </Grid>
      </Container>
    )
  }
}

RecoveryPassword.propTypes = { location: PropTypes.object.isRequired }
