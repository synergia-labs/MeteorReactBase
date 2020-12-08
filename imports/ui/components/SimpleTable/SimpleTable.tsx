import React from 'react'
import { Table,Image,Button,Icon } from 'semantic-ui-react'

interface ISimpleTable {
    schema:object;
    data:object[];
    onClick:(event: React.SyntheticEvent,id:string,doc:object)=>void;
    actions:object[];
}

export default function SimpleTable({schema,data,onClick,actions}:ISimpleTable) {

    const hasOnClick = !!onClick;
    const handleRowClick = (id:string,doc:object) => (event:React.SyntheticEvent) =>{
        if(onClick) {
            onClick(event,id,doc);
        }
    }
    const getType = (field:object) => {
        if(field.isImage||field.isAvatar) {
            return 'image'
        } else if(field.type===Number) {
            return 'number'
        } else if(field.type===String) {
            return 'text'
        } else if(field.isHTML) {
            return 'html'
        } else {
            return 'undefined';
        }
    }

    const renderType = (type:string,data:any) => {
        if(type==='image') {
            return <Image src={data} size='tiny' style={{maxHeight:70,maxWidth:80}} circular />
        } else if(type==='text'||type==='number') {
            return data;
        } else if(type==='html') {
            return Array.isArray(data)?data.map(d=><div dangerouslySetInnerHTML={{__html: d}} />):<div dangerouslySetInnerHTML={{__html: data}} />;
        } else {
            return null;
        }
    }

    const cols = Object.keys(schema).map(field=>({field,label:schema[field].label,type:getType(schema[field])}));

    return (<Table compact>
                <Table.Header>
                    <Table.Row>
                        {cols.map(col=>{
                            return <Table.HeaderCell key={col.name+col.label}>{col.label}</Table.HeaderCell>
                        })}
                        {actions?(
                            <Table.HeaderCell>{'Ações'}</Table.HeaderCell>
                        ):null}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {data.map((row,index) => (
                        <Table.Row onClick={handleRowClick(row._id, row)} style={{...(row.rowStyle?row.rowStyle:{}),cursor:hasOnClick?'pointer':undefined} } key={row._id||row.key||row.name||'row'+index}>
                            {cols.map((col,index)=>{
                                return <Table.Cell key={col.name+col.label} style={{...(schema&&schema[col.field]&&schema[col.field].isImage?{display:'flex',flexDirection:'row',justifyContent:'center'}:{}),
                                width:col.type==='image'?80:undefined}}>{renderType(col.type,row[col.field])}</Table.Cell>
                            })}
                            {actions?(
                                <Table.Cell style={{textAlign:'center'}}>
                                    {actions.map(act=>(
                                        <Button key={act.icon+act.text} onClick={(evt)=>{
                                            evt.preventDefault();
                                            evt.stopPropagation();
                                            act.onClick(row)}
                                        } {...(act.buttonProps||{})} icon={!!act.icon}>
                                            {!!act.icon?(<Icon {...act.icon} />):null}
                                            {!!act.text?(act.text):null}
                                        </Button>
                                    ))}
                                </Table.Cell>
                            ):null}
                        </Table.Row>
                    ))}

                </Table.Body>
            </Table>);
}