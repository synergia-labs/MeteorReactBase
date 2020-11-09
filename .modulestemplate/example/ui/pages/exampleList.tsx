import React from 'react';
import {withTracker} from "meteor/react-meteor-data";
import {exampleApi} from "../../api/exampleApi";
import SimpleTable from "../../../../ui/components/SimpleTable/SimpleTable";
import _ from 'lodash';
import {Button, Container, Header} from "semantic-ui-react";
import {ReactiveVar} from "meteor/reactive-var";
import {initSearch} from '../../../../libs/searchUtils';
import { Icon, Input,Pagination,Dropdown } from 'semantic-ui-react'


const ExampleList = ({examples,history,remove,showDialog,onSearch,total,loading,setPage,setPageSize,searchBy,pageProperties}) => {

    const onClick = (event,id,doc,showDialog) => {
        console.log(history)
        history.push('/example/view/'+id);
    }

    const callRemove=(doc)=>{
        const dialogOptions = {
            icon:'trash',
            title:'Remover exemplo',
            content:()=><p>{`Deseja remover o exemplo "${doc.title}"?`}</p>,
            actions:({closeDialog})=>[
                <Button
                    onClick={closeDialog}
                    secondary>{'Não'}</Button>,
                <Button onClick={()=>{
                    remove(doc);
                    closeDialog();
                    }}
                    primary>{'Sim'}</Button>,
            ]
        };
        showDialog(dialogOptions)
    }


    const [text,setText] = React.useState(searchBy||'')
    const change = (e) => {
        if(text.length!==0&&e.target.value.length===0) {
            onSearch();
        }
        setText(e.target.value);
    }
    const keyPress = (e, a) => {

        if (e.key === 'Enter') {
            if (text && text.trim().length > 0) {
                onSearch(text.trim());
            } else {
                onSearch();
            }
        }
    };

    const click = (...e) => {
        if (text && text.trim().length > 0) {
            onSearch(text.trim());
        } else {
            onSearch();
        }

    }


    return (
        <Container text fluid>
            <Header as='h2'>{'Lista de Exemplos'}</Header>
            <Input value={text} onChange={change} onKeyPress={keyPress}  placeholder='Pesquisar...'
                   action={{ icon: 'search',onClick:click }}
            />
            <SimpleTable
                schema={_.pick(exampleApi.schema,['image','title','description'])}
                data={examples}
                onClick={onClick}
                actions={[{icon:{name:'trash',color:'red'},onClick:callRemove}]}
            />
            {total>0?(
                <div style={{display:'flex',flexDirection:'row',justifyContent:'center',marginTop:15}}>
                    <Pagination
                        defaultActivePage={pageProperties.currentPage}
                        ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                        firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                        lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                        prevItem={{ content: <Icon name='angle left' />, icon: true }}
                        nextItem={{ content: <Icon name='angle right' />, icon: true }}
                        totalPages={parseInt(total/pageProperties.pageSize)||1}
                        onPageChange={(e,data)=>setPage(data.activePage)}
                    />
                    <Dropdown button basic floating options={[
                        { key: '25', text: '25', value: 25 },
                        { key: '50', text: '50', value: 50 },
                        { key: '100', text: '100', value: 100 },
                        { key: '200', text: '200', value: 200 },
                    ]} defaultValue={25}
                              onChange={(e,data)=>setPageSize(data.value||25)}
                              style={{height:48,fontSize:18}}

                    />

                </div>
            ):null}
            <div style={{position:'fixed',bottom:30,right:30}}>
                <Button
                    onClick={()=>history.push('/example/create')}
                    circular
                    icon='add'
                    size={'big'}
                    primary/>
            </div>
        </Container>
        )

}



export const subscribeConfig = new ReactiveVar({
    pageProperties: {
        currentPage: 1,
        pageSize: 25,
    },
    sortProperties: { field: 'createdat', sortAscending: true },
    filter: {},
    searchBy:null,
});

const exampleSearch = initSearch(
    exampleApi, // API
    subscribeConfig, // ReactiveVar subscribe configurations
    ['title','description'], // list of fields
);


export const ExampleListContainer = withTracker((props) => {

    //Reactive Search/Filter
    const config = subscribeConfig.get();
    const sort = {
        [ config.sortProperties.field ]:
            config.sortProperties.sortAscending ? 1 : -1,
    };
    exampleSearch.setActualConfig(config);

    //Subscribe parameters
    const filter = {
        ...config.filter,
    };
    const limit = config.pageProperties.pageSize*config.pageProperties.currentPage;
    const skip = (config.pageProperties.currentPage-1)*config.pageProperties.pageSize;

    //Reactive Counter
    const subHandleCounter = exampleApi.subscribe('defaultCounter',filter);
    const examplesCount = subHandleCounter?(subHandleCounter.ready()?exampleApi.counts.findOne():null):0;

    //Collection Subscribe
    const subHandle = exampleApi.subscribe('default',filter,{sort,limit,skip});
    const examples = subHandle.ready()?exampleApi.find(filter,{sort}).fetch():[]


    return ({
        examples,
        loading:!!subHandle&&!subHandle.ready(),
        remove:(doc)=>{
            exampleApi.remove(doc,(e,r)=>{
                if(!e) {
                    props.showToast({
                        type:'success',
                        title:'Operação realizada!',
                        description: `O exemplo foi removido com sucesso!`,
                    })
                } else {
                    console.log('Error:',e);
                    props.showToast({
                        type:'error',
                        title:'Operação não realizada!',
                        description: `Erro ao realizar a operação: ${e.message}`,
                    })
                }

            })
        }
        searchBy:config.searchBy,
        onSearch: exampleSearch.onSearch,
        total:examplesCount?examplesCount.count:examples.length,
        pageProperties:config.pageProperties,
        setPage: (page=1) => {
            config.pageProperties.currentPage = page;
            subscribeConfig.set(config);
        },
        setPageSize: (size=25) => {
            config.pageProperties.pageSize = size;
            subscribeConfig.set(config);
        },
    })
})(ExampleList)
