// login page overrides the form’s submit event and call Meteor’s loginWithPassword()
// Authentication errors modify the component’s state to be displayed
import React from 'react'
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'
import { Meteor } from 'meteor/meteor'
import { Container, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import SimpleForm from "/imports/ui/components/SimpleForm/SimpleForm";

export default class Signin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      error: '',
      redirectToReferer: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  // Using a ref is accessing the DOM directly and not preferred
  // The React way to get the value from an input is using onChange
  handleChange(e, { name, value }) {
    this.setState({ [name]: value })
  }

  handleSubmit(doc) {
    const { email, password } = doc;
    console.log(doc)

    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        this.props.showToast({
          type:'error',
          title:'Acesso negado!',
          description: err.reason==='Incorrect password'?'Email ou senha inválidos':err.reason,
        });
      } else {
        this.setState({
          redirectToReferer: true,
        })
      }
    })
  }

  render() {
    const self = this;
    const { location } = this.props
    const { redirectToReferer, error } = this.state
    const { from } = location.state || { from: { pathname: '/' } }
    // if correct authentication, redirect to page instead of login screen
    if (redirectToReferer) {
      return <Redirect to={from} />
    }

    const SocialLoginButton = ({onLogin, buttonText, iconClass, customCss, iconOnly}) => (
        <div
            onClick={onLogin}
            className="material-button-contained"
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center', height: 50,
              color: 'white',
              ...customCss,
            }}
        >
          <i className={iconClass}/>
          {!iconOnly && <span style={{marginLeft: 15}}>{buttonText}</span>}
        </div>
    );

    const callbackLogin = (err) => {
      console.log('ERROR',err)
      if (err) {
        console.log('Login Error: ', err);
        if (err.errorType === 'Accounts.LoginCancelledError') {
          this.props.showToast('Autenticação cancelada','error');
          //self.setState({ error: 'AUtenticação cancelada' })
        } else {
          this.props.showToast(err.error,'error');

        }
      } else {
        this.setState({ redirectToReferer: true})
        this.props.history.push('/');
      }
    };

    const loginFacebook = () => {
      Meteor.loginWithFacebook({requestPermissions: ['public_profile', 'email']}, (err) => {
        callbackLogin(err);
      });
    };

    const loginGoogle = () => {
      Meteor.loginWithGoogle({requestPermissions: ['profile', 'email']}, (err) => {
        callbackLogin(err);
      });
    };    

    return (
      <Container>
        <Grid textAlign="center" verticalAlign="middle" centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">
              <Image src="/images/wireframe/logo.png" /> {'Acessar o sistema'}
            </Header>
            <SimpleForm
                schema={{
                  email:{type:'String',label:'Email',optional:false},
                  password:{type:'String',label:'Senha',optional:false},
                }}

                onSubmit={this.handleSubmit}>
              <Segment stacked>
                <Form.Input
                  label="Email"
                  icon="user"
                  iconPosition="left"
                  name="email"
                  type="email"
                  placeholder="Digite seu email"

                />
                <Form.Input
                  label="Senha"
                  icon="lock"
                  iconPosition="left"
                  name="password"
                  placeholder="Digite sua senha"
                  type="password"
                />
                <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                  <a onClick={()=>this.props.history.push('/recovery-password')}style={{cursor:'pointer',width:180}}>{'Esqueci a minha senha'}</a>
                  <Form.Button content="Entrar" />
                </div>

              </Segment>
            </SimpleForm>
            <Message>
              <Link to="/signup">{'É novo por aqui? Clique aqui para se cadastrar!'}</Link>
            </Message>
            <div key="loginoptions" style={{
              paddingRight: 5,
              width: '102%',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div key="divBtnGoogle" style={{width: '100%'}}>
                <SocialLoginButton
                    key="btnGoogle"
                    iconClass={'google icon'}
                    onLogin={loginGoogle}
                    buttonText={'Login pelo Google'}
                    customCss={{background: '#dd4b39', width: '100%',cursor:'pointer'}}
                /></div>
              <div key="divBtnFaceboook" style={{width: '100%'}}>
                <SocialLoginButton
                    key="btnFaceboook"
                    iconClass={'facebook icon'}
                    onLogin={loginFacebook}
                    buttonText={'Login pelo Facebook'}
                    customCss={{background: '#3B5998', width: '100%',cursor:'pointer'}}
                /></div>
            </div>
          </Grid.Column>
        </Grid>
      </Container>
    )
  }
}

Signin.propTypes = { location: PropTypes.object.isRequired }
