import React from 'react'
import { Table,Image,Button,Icon } from 'semantic-ui-react'


export default function SimpleTable({schema,data,onClick,actions}) {

    const hasOnClick = !!onClick;
    const handleRowClick = (id,doc) => (event) =>{
        if(onClick) {
            onClick(event,id,doc);
        }
    }
    const getType = (field) => {
        if(field.isImage||field.isAvatar) {
            return 'image'
        } else if(field.type===Number) {
            return 'number'
        } else if(field.type===String) {
            return 'text'
        } else {
            return 'undefined';
        }
    }

    const renderType = (type,data) => {
        if(type==='image') {
            return <Image src={data} size='tiny' style={{maxHeight:70,maxWidth:80}} circular />
        } if(type==='text'||type==='number') {
            return data;
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
                                return <Table.Cell key={col.name+col.label} style={{width:col.type==='image'?80:undefined}}>{renderType(col.type,row[col.field])}</Table.Cell>
                            })}
                            {actions?(
                                <Table.Cell>
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