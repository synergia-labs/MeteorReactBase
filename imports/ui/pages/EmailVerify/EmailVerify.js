import React from 'react';

let emailVerified = false;
const EmailVerify = props => {
    Accounts.verifyEmail(props.match.params.token, (err, res) => {

        if (err) {
            if (!emailVerified) {
                props.showToast({
                    type:'error',
                    title:'Problema com o Token!',
                    description: 'Email não verificado. Solicite um novo token!',
                });
                props.history.push('/');
            }

        } else {
            emailVerified = true;
            props.showToast({
                type:'success',
                title:'Email Verificado',
                description: 'Seu e-mail foi verificado com sucesso, seja bem vindo!',
            });

            props.history.push('/');
        }
    });
    return <div/>;
};

export default EmailVerify;
