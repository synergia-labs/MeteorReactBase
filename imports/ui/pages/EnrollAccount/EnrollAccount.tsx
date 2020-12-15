import React from 'react'
import {Grid, Header, Image, Message} from 'semantic-ui-react'

let emailVerified = false;
const EnrollAccount = (props) => {

    const [status,setStatus] = React.useState(null)
    console.log('props',props);
    if(!status) {
        Accounts.verifyEmail(props.match.params.token, (err, res) => {

            console.log(err,'<>',res)
            if (err) {
                if(err.reason==='Verify email link expired') {
                    setStatus('Problema na verificação do Email: Token expirado, solicite uma nova senha!');
                } else {
                    setStatus('Problema na verificação do Email: Token Inválido, tente novamente');
                }

            } else {
                setTimeout(()=>{
                    props.history.push('/');
                },2000)
                setStatus('Email verificado com sucesso! Redirecionando, aguarde....');
            }
        }
    }

    return (
        <Header as="h2" textAlign="center">
            <Image src="/images/wireframe/logo.png" />

            <Message>
                <p>{!status?'Verificando token, aguarde....':status}</p>
            </Message>

        </Header>
    )
}

export default EnrollAccount
