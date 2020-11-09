import React from 'react';
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import { Button, Header, Icon, Modal } from 'semantic-ui-react'

import 'react-semantic-toasts/styles/react-semantic-alert.css';

const DialogContainer = (options={open:false,onClose:()=>{},onOpen:()=>{}}) => {
    return (
        <Modal
            basic
            onClose={options.onClose}
            onOpen={options.onOpen}
            open={options.open}
            size='mini'
        >
            {options.title?(
                <Header icon={!!options.icon}>
                    {!!options.icon?<Icon name={options.icon} />:null}
                    {options.title}
                </Header>
            ):null}
            {options.content?(
                <Modal.Content>
                    {options.content(options)}
                </Modal.Content>
            ):null}
            {options.actions?(
                <Modal.Actions>
                    {options.actions(options)}
                </Modal.Actions>
            ):null}

        </Modal>
    );
}

class GeneralComponents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogOptions:null,
        }
        this.RenderAppComponent = props.render({
            showToast:this.showToast,
            showDialog:this.showDialog,
        });
    }

    showToast = (options={}) => {
        toast({...{
            type: 'warning',
            icon: 'envelope',
            title: 'Warning Toast',
            description: 'This is a Semantic UI toast wich waits 5 seconds before closing',
            animation: 'bounce',
            time: 5000,
            onClose: () => console.log('you close this toast'),
            onClick: () => console.log('you click on the toast'),
            onDismiss: () => console.log('you have dismissed this toast')
        },...options});
    }

    showDialog = (options={}) =>{
        this.setState({dialogOptions:{
                open:true,
                onClose:()=>this.setState({dialogOptions:null}),
                onOpen:()=>{},
                closeDialog:()=>this.setState({dialogOptions:null}),
                ...options,
            }})
    }

    render(){

        return(
            <React.Fragment>
                <SemanticToastContainer />
                {this.state.dialogOptions?<DialogContainer {...this.state.dialogOptions} />:null}
                {this.RenderAppComponent}
            </React.Fragment>
        )
    }
}

export default GeneralComponents;