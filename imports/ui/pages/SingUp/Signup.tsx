// signup component similar to login page (except loginWithPassword)
// instead createUser to insert a new user account document

// login page overrides the form’s submit event and call Meteor’s loginWithPassword()
// Authentication errors modify the component’s state to be displayed
import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { Accounts } from 'meteor/accounts-base'
import {userprofileApi} from "../../../userprofile/api/UserProfileApi";




export default class Signup extends React.Component {
  constructor(props) {
    super(props)
    this.state = { email: '', password: '', error: '' }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  // Using a ref is accessing the DOM directly and not preferred
  // The React way to get the value from an input is using onChange
  handleChange(e, { name, value }) {
    this.setState({ [name]: value })
  }

  handleSubmit() {
    const { email, password } = this.state

    userprofileApi.insertNewUser({ email, username: email, password },(err,r) => {
      if (err) {
        this.setState({ error: err.reason })
      } else {
        console.log('Cadastrado com sucesso');
      }
    })

  }

  render() {
    const { error } = this.state
    return (
      <Container>
        <Grid textAlign="center" verticalAlign="middle" centered columns={2}>
          <Grid.Column>
            <Header as="h2" textAlign="center">
              <Image src="/images/wireframe/logo.png" /> {'Cadastrar no sistema'}
            </Header>
            <Form onSubmit={this.handleSubmit}>
              <Segment stacked>
                <Form.Input
                  label="Email"
                  icon="user"
                  iconPosition="left"
                  name="email"
                  type="email"
                  placeholder="Digite um email"
                  onChange={this.handleChange}
                />
                <Form.Input
                  label="Senha"
                  icon="lock"
                  iconPosition="left"
                  name="password"
                  placeholder="Digite uma senha"
                  type="password"
                  onChange={this.handleChange}
                />
                <Form.Button content="Cadastrar" />
              </Segment>
            </Form>
            <Message>
              Já tem uma conta? Faça login clicando <Link to="/signin">aqui</Link>
            </Message>
            {error === '' ? '' : <Message error header="Erro ao fazer registro!" content={error} />}
          </Grid.Column>
        </Grid>
      </Container>
    )
  }
}
