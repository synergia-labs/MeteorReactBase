import React, { Component } from 'react'
import {Button, Container, Form} from 'semantic-ui-react'
import {hasValue, isBoolean} from "../../../libs/hasValue";
import _ from 'lodash';
import {Message,Icon } from 'semantic-ui-react'
import {groupApi} from "/imports/modules/group/api/groupApi";
import shortid from 'shortid';
import { ReactSortable } from "react-sortablejs";


interface ISubFormArrayComponent {
    reactElement:any;
    childrensElements:any;
    name:string;
    mode:string;
    fieldSchema:object;
    initialValue?:any;
    setDoc: ({})=>void;
    setFieldMethods: ({})=>any;

}

const SubFormArrayComponent = ({reactElement,childrensElements,name,initialValue,...props}:ISubFormArrayComponent) => {

    const [error,setError] = React.useState(false)
    const [value,setValue] = React.useState(initialValue||[])
    const [stringValue,setStringValue] = React.useState('')
    const [mode,setMode] = React.useState(props.mode||'edit')
    const [changeByUser,setChangeByUser] = React.useState(false)

    const formRefs = {};

    React.useEffect(() => {
        if(!changeByUser&&(!value||value.length===0)&&(initialValue||[]).length>0) {
            setValue(initialValue);
        }
        if(mode!==props.mode) {
            setMode(props.mode);
        }
    });

    props.setFieldMethods({
        validateRequired: (hasError:boolean)=>{
            if(!hasValue(value)) {
                setError(true);
                return false;
            }
            return true;

        },
        validateRequiredSubForm:()=>{
            let result = true;
            Object.keys(formRefs).forEach(key=>{
                const subFormRef = formRefs[key];
                if(!subFormRef.validate()) {
                    setError(true);
                    result = false;
                }
            });

            return result;
        },
        setValue:(newValue:any)=>{
            if(hasValue(newValue)) {
                setValue(newValue);
                return true;
            }
            return false;

        },
        setMode:(newMode:string)=>{
            if(newMode!==mode) {
                setMode(newMode);
                return true;
            }
            return false;
        },
    })



    const onChange = (e,fieldData={})=>{
        const field = {...(props.fieldSchema?props.fieldSchema:{}),...(e?e.target:{}),
            ...(fieldData&&fieldData.name?fieldData:{})};

        if(props.fieldSchema&&props.fieldSchema.type===Boolean&&isBoolean(field.checked)) {
            setValue(field.checked);
            props.setDoc({[name]:field.checked});
            if(!changeByUser&&(field.value||[]).length>0) {
                setChangeByUser(true);
            }
            if(reactElement.props.onChange) {
                reactElement.props.onChange(e,{...field,value:field.checked});
            }
        } else {
            setValue(field.value);
            props.setDoc({[name]:field.value});
            if(!changeByUser&&(field.value||[]).length>0) {
                setChangeByUser(true);
            }
            if(reactElement.props.onChange) {
                reactElement.props.onChange(e,field);
            }
        }



    }

    const onSortDocs = (list) => {
        setValue(list);
        setStringValue(list.toString());
        onChange({target:{
                value:list,
            }})
    }

    const addSubForm = () => {
        const newValue = (value||[]);

        newValue.push({
            id:shortid.generate();
        })

        setValue(newValue);
        setStringValue(newValue.toString())
    }

    const onFormChangeHandle = formId => (doc) => {
        const newDoc = (value||[]).map(subDoc=>{
            if(subDoc.id===formId) {
                subDoc = {...subDoc,...doc}
            }

            delete subDoc.chosen;
            return subDoc;
        })

        onChange({target:{
                value:newDoc,
            }})
    }
    const onClickDelete = formId => doc =>{
        const newDoc = (value||[]).filter(subDoc=>subDoc.id!==formId)

        onChange({target:{
                value:newDoc,
            }})
    }

    const label = reactElement.props.label||(props.fieldSchema?props.fieldSchema.label:undefined);

    return (
        <div style={{width:'100%'}}>
            {hasValue(label)?(<label
                style={{
                    display: 'block',
                    margin: '0em 0em 0.28571429rem 0em',
                    color: '#212121',
                    fontSize: '0.92857143em',
                    fontWeight: 'bold',
                    textTransform: 'none',
                }}
            >{label}</label>):null}
            <div style={{width:'100%',marginLeft:10}}>

                <ReactSortable
                    disabled={mode==='view'}
                    list={value||[]}
                    setList={onSortDocs}
                    handle={'.dragButton'}
                >
                    {(value||[]).map(subForm=>{

                        return (
                            <div key={subForm.id} style={{border:'1px solid #DDD',margin:3,display:'flex',flexDirection:'row'}}>
                                <SimpleForm
                                    ref={refForm=>formRefs[subForm.id]=refForm}
                                    key={subForm.id}
                                    mode={mode}
                                    schema={props.fieldSchema&&props.fieldSchema.subSchema?props.fieldSchema.subSchema:undefined}
                                    doc={subForm}
                                    onFormChange={onFormChangeHandle(subForm.id)}
                                >
                                    {childrensElements}
                                </SimpleForm>
                                {mode!=='view'?(
                                    <div style={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                        <Button type="button" icon={'trash'} onClick={onClickDelete(subForm.id)} />
                                    </div>
                                ):null}
                                {mode!=='view'?(
                                <div style={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                    <Button type="button" className={'dragButton'} icon={'th'} />
                                </div>
                                ):null}

                            </div>
                        )

                    })}
                </ReactSortable>



            </div>
            {mode!=='view'?(<div style={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
                <Button icon={'add'}
                        type="button"
                        onClick={addSubForm}
                />
            </div>):null}

        </div>
    );
}

interface ISubFormComponent {
    reactElement:any;
    childrensElements:any;
    name:string;
    mode:string;
    fieldSchema:object;
    initialValue?:any;
    setDoc: ({})=>void;
    setFieldMethods: ({})=>any;

}

const SubFormComponent = ({reactElement,childrensElements,name,...props}:ISubFormComponent) => {

    const [error,setError] = React.useState(false)
    const [value,setValue] = React.useState(props.initialValue||{})
    const [mode,setMode] = React.useState(props.mode||'edit')
    const [changeByUser,setChangeByUser] = React.useState(false)

    let formRef = {}

    React.useEffect(() => {

        if(!changeByUser&&!hasValue(value)&&!!hasValue(props.initialValue)) {
            setValue(props.initialValue);
        }


        if(mode!==props.mode) {
            setMode(props.mode);
        }



    });

    props.setFieldMethods({
        validateRequired: ()=>{
            if(!hasValue(value)) {
                setError(true);
                return false;
            }
            return true;

        },
        validateRequiredSubForm:()=>{
            let result = true;

                if(!formRef.validate()) {
                    setError(true);
                    result = false;
                }

            return result;
        },
        setValue:(newValue:any)=>{
            if(hasValue(newValue)) {
                setValue(newValue);
                return true;
            }
            return false;

        },
        setMode:(newMode:string)=>{
            if(newMode!==mode) {
                setMode(newMode);
                return true;
            }
            return false;
        },
    })



    const onChange = (e,fieldData={})=>{
        const field = {...(props.fieldSchema?props.fieldSchema:{}),...(e?e.target:{}),
            ...(fieldData&&fieldData.name?fieldData:{})};

        if(props.fieldSchema&&props.fieldSchema.type===Boolean&&isBoolean(field.checked)) {
            setValue(field.checked);
            props.setDoc({[name]:field.checked});
            if(!changeByUser) {
                setChangeByUser(true);
            }
            if(reactElement.props.onChange) {
                reactElement.props.onChange(e,{...field,value:field.checked});
            }
        } else {
            setValue(field.value);
            props.setDoc({[name]:field.value});
            if(!changeByUser) {
                setChangeByUser(true);
            }
            if(reactElement.props.onChange) {
                reactElement.props.onChange(e,field);
            }
        }



    }

    const onFormChangeHandle = (doc) => {
        onChange({target:{
            value:doc,
            }})
    }

    const label = reactElement.props.label||(props.fieldSchema?props.fieldSchema.label:undefined);
    return (
        <div style={{width:'100%'}}>
            {hasValue(label)?(<label
                style={{
                    display: 'block',
                    margin: '0em 0em 0.28571429rem 0em',
                    color: '#212121',
                    fontSize: '0.92857143em',
                    fontWeight: 'bold',
                    textTransform: 'none',
                }}
            >{label}</label>):null}
            <div style={{border:'1px solid #ddd',margin:3,marginLeft:10}}>
                <SimpleForm
                        ref={fRef=>formRef=fRef}
                        mode={mode}
                        schema={props.fieldSchema&&props.fieldSchema.subSchema?props.fieldSchema.subSchema:undefined}
                        doc={value}
                        onFormChange={onFormChangeHandle}
                        >
                    {childrensElements}
                </SimpleForm>
            </div>

            </div>
    );
}



interface IFieldComponent {
    reactElement:any;
    name:string;
    mode:string;
    fieldSchema:object;
    initialValue?:any;
    setDoc: ({})=>void;
    setFieldMethods: ({})=>any;

}
const FieldComponent = ({reactElement,name,...props}:IFieldComponent) => {

    const [error,setError] = React.useState(false)
    const [value,setValue] = React.useState(props.initialValue||'')
    const [mode,setMode] = React.useState(props.mode||'edit')
    const [changeByUser,setChangeByUser] = React.useState(false)

    React.useEffect(() => {
        
           if(!changeByUser&&!hasValue(value)&&!!hasValue(props.initialValue)) {
                setValue(props.initialValue);
            }


        if(mode!==props.mode) {
            setMode(props.mode);
        }
        
        

    });

    props.setFieldMethods({
        validateRequired: ()=>{
            if(!hasValue(value)) {
                setError(true);
                return false;
            }
            return true;

        },
        setValue:(newValue:any)=>{
            if(hasValue(newValue)) {
                setValue(newValue);
                return true;
            }
            return false;

        },
        setMode:(newMode:string)=>{
            if(newMode!==mode) {
                setMode(newMode);
                return true;
            }
            return false;
        },
    })



    const onChange = (e,fieldData={})=>{
        const field = {...(props.fieldSchema?props.fieldSchema:{}),...(e?e.target:{}),
        ...(fieldData&&fieldData.name?fieldData:{})};

        if(props.fieldSchema&&props.fieldSchema.type===Boolean&&isBoolean(field.checked)) {
            setValue(field.checked);
            props.setDoc({[name]:field.checked});
            if(!changeByUser) {
                setChangeByUser(true);
            }
            if(reactElement.props.onChange) {
                reactElement.props.onChange(e,{...field,value:field.checked});
            }
        } else {
            setValue(field.value);
            props.setDoc({[name]:field.value});
            if(!changeByUser) {
                setChangeByUser(true);
            }
            if(reactElement.props.onChange) {
                reactElement.props.onChange(e,field);
            }            
        }



    }

    return (React.cloneElement(reactElement, { value, onChange,
            error:error&&(!value||value.length===0)?true:undefined,
            label:reactElement.props.label||(props.fieldSchema?props.fieldSchema.label:undefined),
            readOnly:mode==='view',
            transparent:mode==='view'?true:undefined,
            checked:(props.fieldSchema&&props.fieldSchema.type===Boolean?value:undefined)
        }))
}

interface ISimpleFormProps {
    schema: [] | {};
    onSubmit:(submit:()=>void)=> void;
    mode?:string;
    children?:object[];
    doc?:object;
    loading?:boolean;
    styles?:object;
    onFormChange:(onChange:()=>void)=> void;
}

class SimpleForm extends Component<ISimpleFormProps> {

    docValue = {};
    fields = {};
    state = {error:null,
    mode:this.props.mode||'edit',
    formElements:null,
    };

    setDoc = (newDoc) => {
    this.docValue = {...this.docValue,...newDoc};
    if(this.props.onFormChange) {
        this.props.onFormChange(this.docValue)
    }
    }

    getDoc = () => {
        return this.docValue;
    }

    
    wrapElement = (element,index) => {
        const self=this;

        if(!element.type) {
            return element;
        }

        if(element.type.name==='FormButton') {
            return React.cloneElement(element, {
               type:element.props.onChange?'button':'submit',
               onSubmit:element.props.onChange?undefined:element.props.onSubmit,
            })
        } else if(element.type.name==='Button') {
            return element;
        }
        self.fields[element.props.name]={type:element.type.name,};
        if(element.type.name==='FormGroup'&&element.props.formType==='subform'&&!!element.props.name) {
            return <SubFormComponent
                name={element.props.name}
                childrensElements={element.props.children}
                key={element.props.name?element.props.name:('el'+index)}
                fieldSchema={self.props.schema?self.props.schema[element.props.name]:undefined}
                initialValue={self.props.doc?self.props.doc[element.props.name]:''}
                reactElement={element}
                setDoc={this.setDoc}
                mode={self.props.mode}
                setFieldMethods={(methods)=>self.fields[element.props.name]={...self.fields[element.props.name],...methods}}
            />

        } else if(element.type.name==='FormGroup'&&element.props.formType==='subformArray'&&!!element.props.name) {
            return <SubFormArrayComponent
                name={element.props.name}
                childrensElements={element.props.children}
                key={element.props.name?element.props.name:('el'+index)}
                fieldSchema={self.props.schema?self.props.schema[element.props.name]:undefined}
                initialValue={self.props.doc?self.props.doc[element.props.name]:''}
                reactElement={element}
                setDoc={this.setDoc}
                mode={self.props.mode}
                setFieldMethods={(methods)=>self.fields[element.props.name]={...self.fields[element.props.name],...methods}}
            />

        } else if(element.type.name==='FormGroup'||element.type.name==='Segment'||React.Children.toArray(element.props.children).length>0) {
            const subElements = React.Children.toArray(element.props.children).map((element,index)=>{
                return self.wrapElement(element,index)
            });
            const newElement = React.cloneElement(element, { children: subElements })
            return newElement;
        } else {
            return <FieldComponent
                name={element.props.name}
                key={element.props.name?element.props.name:('el'+index)}
                fieldSchema={self.props.schema?self.props.schema[element.props.name]:undefined}
                initialValue={self.props.doc?self.props.doc[element.props.name]:''}
                reactElement={element}
                setDoc={this.setDoc}
                mode={self.props.mode}
                setFieldMethods={(methods)=>self.fields[element.props.name]={...self.fields[element.props.name],...methods}}
            />
        }

    }
    
    initFormElements = (update=false) => {
        const self = this;
        if(!update&&(!!this.formElements||!!this.state.formElements)) {
            return this.state.formElements||this.formElements;
        }

        let elements = React.Children.toArray(this.props.children);
        const ListaOfElements = elements.map((element,index)=>{
            return this.wrapElement(element,index)
        })

        return ListaOfElements;

    }

    validate = () => {
        const self = this;
        const fielsWithError = [];

        if(this.props.schema) {
            Object.keys(this.fields).forEach(field=>{
                if(this.props.schema[field]&&this.props.schema[field].subSchema){
                    if(this.props.schema[field]&&!this.props.schema[field].optional&&!this.fields[field].validateRequired()){
                        fielsWithError.push(this.props.schema[field].label);
                    }
                    if(!this.props.schema[field].optional&&!this.fields[field].validateRequiredSubForm()) {
                        fielsWithError.push(this.props.schema[field].label);
                    }


                } else if(this.props.schema[field]&&!this.props.schema[field].optional&&!this.fields[field].validateRequired()) {
                    fielsWithError.push(this.props.schema[field].label);
                }
            })
        }

        if(fielsWithError.length>0) {
            this.setState({error:fielsWithError});
        } else if(!!this.state.error) {
            this.setState({error:null});
        }

        return fielsWithError.length===0;
    }

    onSubmitForm = (event,...others) => {
       if(this.props.onSubmit&&this.validate()) {
           this.props.onSubmit(this.docValue)
       } else {
           console.log('Erro no formulário')
       }
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if((!_.isEqual(this.props.doc,prevProps.doc))||(this.props.mode!==prevProps.mode)) {
            const update=true;
            this.docValue = {...this.docValue,...(this.props.doc||{})};
            this.setState({formElements:this.initFormElements(update)});
            this.setState({mode:this.props.mode});
        }

    }

    render() {

        this.formElements = this.state.formElements||this.initFormElements();

        return (
            <div style={this.props.style||{width:'100%'}}>
                <Form  onSubmit={this.onSubmitForm} loading={this.props.loading}>
                    {this.formElements}
                </Form>
                {this.state.error?(
                <Message attached='bottom' warning>
                    <Icon name='warning' />
                    {'Há erros nos seguintes campos:'+this.state.error.join(', ')}
                </Message>
                ):null}
            </div>
                )
    }
}
export default SimpleForm

