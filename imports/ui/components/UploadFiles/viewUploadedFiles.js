import {withTracker} from 'meteor/react-meteor-data';
import React from 'react';
import {attachmentsCollection} from '/imports/api/attachmentsCollection';
import { List, Icon} from 'semantic-ui-react'
import _ from 'lodash'
import Progress from "semantic-ui-react/dist/commonjs/modules/Progress";
import {hasValue} from "/imports/libs/hasValue";

const {grey100, grey500, grey700} = ['#eeeeee','#c9c9c9','#a1a1a1'];

const stylesTheme = theme => {
    return {
        barColorSecondary: {
            backgroundColor: '#c10000',
        },
    };
};

const styles = {
    textoUploadArquivo: {
        color: grey700,
        fontFamily: '\'pt-sans\', \'Roboto\', \'Helvetica\', \'Arial\', \'sans-serif\'',
        fontSize: '1.8rem',
    },
    defaultStyle: {
        width: '100%',
        minHeight: 80,
        flex: 1,
        textAlign: 'center',
        borderColor: grey500,
        backgroundColor: grey100,
        borderWidth: '2px',
        borderStyle: 'dashed',
    },
    estiloDoOu: {
        fontSize: '1.5rem',
        color: grey700,
        fontFamily: '\'pt-sans\', \'Roboto\', \'Helvetica\', \'Arial\', \'sans-serif\'',
        marginBottom: '0.2em',
    },
    iconStyles: {
        fontSize: '3.8rem',
        color: grey700,
    },
    botaoUploadStyle: {},

    linhaExclusaoStyle: {
        backgroundColor: grey700,
        textDecoration: 'line-through',
    },

    estiloDoContainerDoUploadFile: {
        height: '170px',
    },

    circularProgress: {
        paddingTop: '50px',
    },
    divTeste: {
        position: 'absolute',
        top: '190%',
        left: '50%',
        button: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

const getFileSize = (size) => {
    return ((size / 1024 < 1000) ? `${(size / 1024).toFixed(2)}KB` : `${(size /
        (1024 * 1024)).toFixed(2)}MB`);
};

class ViewUploadedFile extends React.Component {
    constructor(props) {
        super(props);
        this.arquivosServ = this.props.value || [];
        this.state = {
            files: [],
            arquivosBase64: [],
            links: [],
            linksServidor: [],
            tabelaArquivos: null,
            isEmUpload: false,
            arquivos: this.props.attachments || [],
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            arquivos: nextProps.attachments || [],
            attachmentsExists: nextProps,
        };
    }

    componentDidMount() {
        const arquivos = this.props.attachments || [];

        console.log('aruiqovs>',arquivos)
        if (!!arquivos) {
            this.setState({arquivos});
            this.mostrarLinksArquivos(arquivos);
        }

    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        const arquivos = this.props.attachments || [];

        if (!_.isEqual(this.props.attachments, prevProps.attachments)) {
            this.mostrarLinksArquivos(arquivos);
        }

        return null;
    }

    getIcon = (mimeType) => {
        if (!mimeType) {
            return '-';
        }

        const type = {
            base: mimeType.split('/')[0],
            fileType: mimeType.split('/')[1],
        };

        switch (type.base) {
            case 'text':
                return <Icon name="book"/>;
            case 'audio':
                return <Icon name="music"/>;
            case 'image':
                return <Icon name="image"/>;
            case 'video':
                return <Icon name="file video"/>;

            case 'application':
                if (type.fileType === 'pdf') {
                    return <Icon name="book"/>;
                }
                if (type.fileType.indexOf('msword') !== -1) {
                    return <Icon name="book"/>;
                }
                return <Icon name="paperclip"/>;

            default:
                return <Icon name="paperclip"/>;
        }
    };

    mostrarLinksArquivos = (arquivos) => {
        let listaArquivos = [];
        console.log('MOSTRAR LINKS',arquivos)
        if (arquivos.length > 0) {
            listaArquivos = arquivos.map(item => {
                const link = item.status && item.status === 'InProgress'
                    ? item.link
                    : attachmentsCollection.attachments.findOne({_id: item._id}).link();
                return {
                    name: item.name,
                    link,
                    id: item._id,
                    size: item.size,
                    status: item.status || 'Complete',
                    type: item['mime-type'],
                    identificador: item.name,
                };
            });
        }


        this.setState({
            links: [...listaArquivos],
        });
    };

    getList = () => {
        return (this.state.links.length > 0
            ? <List divided relaxed>
                {this.state.links.map(item => {
                    const filetype = item.type ? item.type.split('/')[0] : null;

                    return (
                        <List.Item
                            key={item.id}
                            onClick={() => {
                                if ((filetype === 'video' || filetype === 'audio') && this.props.doc &&
                                    this.props.doc._id) {
                                    window.open(`/media/${this.props.doc._id}/${item.id}`, item.name);
                                } else {
                                    this.downloadURI(item.link, item.name);
                                }
                            }}
                        >
                            <List.Icon size='large' verticalAlign='middle'>
                                {filetype ? (item.status && item.status === 'InProgress' ? (
                                    this.getIcon(this.state.uploadFileMimeType || null)
                                ) : (
                                    this.getIcon(item.type)
                                )) : (
                                    <Icon name="cloud upload"/>
                                )}
                            </List.Icon>
                            <List.Content style={{width:'100%'}}>
                                <List.Header as='a'>
                                    {item.name}
                                </List.Header>
                                <List.Description as='a'>
                                    {item.status && item.status === 'InProgress' ? (
                                        <Progress percent={item.status && item.status === 'InProgress' && item.index ===
                                        this.currentFileUpload ? this.state.progress : (item.status && item.status ===
                                        'InProgress' ? 0 : 100)} success>
                                            The progress was successful
                                        </Progress>
                                    ) : (
                                        item.size / 1024 < 1000 ? `${(item.size / 1024).toFixed(2)}KB` : `${(item.size /
                                            (1024 * 1024)).toFixed(2)}MB`
                                    )}
                                </List.Description>
                            </List.Content>
                            <List.Icon size='large' verticalAlign='middle'
                                       name="cloud download"
                                       onClick={() => {
                                           if ((filetype === 'video' || filetype === 'audio') && this.props.doc &&
                                               this.props.doc._id) {
                                               window.open(`/media/${this.props.doc._id}/${item.id}`, item.name);
                                           } else {
                                               this.downloadURI(item.link, item.name);
                                           }
                                       }}
                            />
                        </List.Item>
                    )
                })
                }
            </List>
            : <span style={{color: '#AAAAAA'}}>{'Não há arquivos'}</span>)


    };



    getTabela = () => {
        return (
            <table className="table">
                <thead>
                <tr>
                    <th scope="col" style={{color: '#2d5441'}}> {'name'}</th>
                    <th scope="col" width="50px"
                        style={{color: '#2d5441', maxWidth: 50, width: 50, padding: 7, margin: 0}}>{'type'}</th>
                    <th scope="col" style={{color: '#2d5441', maxWidth: 80, width: 80}}>{'tamanho'}</th>
                </tr>
                </thead>
                <tbody>
                {this.state.links.length > 0
                    ? this.state.links.map(item => {
                        return this.getLinha(item);
                    })
                    : null}
                {this.renderizaMensagemTabelaVazia()}
                </tbody>
            </table>
        );
    };

    downloadURI = (uri, name) => {
        var link = document.createElement('a');
        link.download = name;
        link.href = uri;
        link.click();
    };

    getLinha = item => {

        const filetype = item.type.split('/')[0];
        return (
            <tr
                style={{cursor: 'pointer', color: '#000000'}}
                key={item.id}
                onClick={() => {
                    if ((filetype === 'video' || filetype === 'audio') && this.props.doc &&
                        this.props.doc._id) {
                        window.open(`/media/${this.props.doc._id}/${item.id}`, item.name);
                    } else {
                        this.downloadURI(item.link, item.name);
                    }
                }}
            >
                <td scope="row" style={{width: '100%', textAlign: 'left'}}>

                    {item.name}

                </td>
                <td scope="row" style={{maxWidth: 100, width: '100%', textAlign: 'center'}}>
                    {item.status && item.status === 'InProgress' ? (
                        this.getIcon(this.state.uploadFileMimeType || null)
                    ) : (
                        this.getIcon(item.type)
                    )}
                </td>
                <td scope="row" style={{width: '100%', textAlign: 'center'}}>
                    {item.status && item.status === 'InProgress' ? (
                        this.state.uploadFileSize || '0KB'
                    ) : (
                        item.size / 1024 < 1000 ? `${(item.size / 1024).toFixed(2)}KB` : `${(item.size /
                            (1024 * 1024)).toFixed(2)}MB`
                    )}
                </td>
            </tr>
        );
    };

    renderizaMensagemTabelaVazia = () => {
        if (
            this.state.linksServidor.length === 0
            && this.state.links.length === 0
        ) {
            return (
                <tr>
                    <td scope="row">
                        <div style={{width: '100%'}}>
                            {this.props.mensagens.tabelaVazia || null}
                        </div>
                    </td>
                    <td scope="row"/>
                    <td scope="row"/>
                </tr>
            );
        }
    };

    render() {

        return (
            <div style={{flex: 1, flexWrap: 'wrap', flexDirection: 'column'}}>
                {hasValue(this.props.label)?(<label
                    style={{
                        display: 'block',
                        margin: '0em 0em 0.28571429rem 0em',
                        color: '#212121',
                        fontSize: '0.92857143em',
                        fontWeight: 'bold',
                        textTransform: 'none',
                    }}
                >{this.props.label}</label>):null}
                {this.getList()}
            </div>
        );
    }
}

ViewUploadedFile.defaultProps = {
    mensagens: {
        tabelaVazia:'Tabela Vazia',
    },
};

const ViewUploadedFileCollection = withTracker(props => {
    const handleAttachments = Meteor.subscribe('files-attachments', {
        'meta.docId': props.doc ? props.doc._id || 'No-ID' : 'No-ID',
    });
    const loading = !handleAttachments.ready();
    const attachments = attachmentsCollection.find({
        'meta.docId': props.doc ? props.doc._id || 'No-ID' : 'No-ID',
        'meta.fieldName': props.name ? props.name || 'No-FieldName' : 'No-FieldName',
    }).fetch();
    const attachmentsExists = !loading && !!attachments;

    return {
        loading,
        attachments,
        attachmentsExists,
        ...props,
    };
})(ViewUploadedFile);

export default ViewUploadedFileCollection;
