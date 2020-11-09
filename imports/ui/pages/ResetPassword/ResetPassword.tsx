// login page overrides the form’s submit event and call Meteor’s loginWithPassword()
// Authentication errors modify the component’s state to be displayed
import React from 'react'
import PropTypes from 'prop-types'
import { Meteor } from 'meteor/meteor'
import { Container, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import SimpleForm from "/imports/ui/components/SimpleForm/SimpleForm";

export default class ResetPassword extends React.Component {
  onSubmit = doc => {
    const {password, repassword} = doc;
    if(password!==repassword) {
      this.props.showToast({
        type:'error',
        title:'Error!',
        description: 'As senhas não conferem!!Digite novamente!',
      });
      return;
    }
    Accounts.resetPassword(
        this.props.match.params.token,
        password,
        (err, res) => {
          if (err) {
            this.props.showToast({
              type:'error',
              title:'Problema na definição da senha!',
              description: 'Não foi possível atualizar a sua senha, faça contato com o administrador!',
            });
          } else {
            this.props.showToast({
              type:'success',
              title:'Senha atualizada!',
              description: 'Sua senha foi atualizada com sucesso!!',
            });
            this.props.history.push('/');
          }
        }
    );
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
                  password:{type:'String',label:'Email',optional:false},
                  repassword:{type:'String',label:'Email',optional:false},
                }}

                onSubmit={this.onSubmit}>
              <Segment stacked>
                <Form.Input
                  label="Digite uma nova senha"
                  icon="lock"
                  iconPosition="left"
                  name="password"
                  type="password"
                  placeholder="Digite uma nova senha"
                />
                <Form.Input
                    label="Repita a senha"
                    icon="lock"
                    iconPosition="left"
                    name="repassword"
                    type="password"
                    placeholder="Repita a nova senha"
                />
                <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                  <a onClick={()=>this.props.history.push('/signin')} style={{cursor:'pointer',width:180}}>{'Voltar'}</a>
                  <Form.Button content="Atualizar a senha" />
                </div>

              </Segment>
            </SimpleForm>

          </Grid.Column>
        </Grid>
      </Container>
    )
  }
}

ResetPassword.propTypes = { location: PropTypes.object.isRequired }
