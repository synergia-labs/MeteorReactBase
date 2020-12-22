import React from "react";
import _ from 'lodash';
import {hasValue} from "/imports/libs/hasValue";
import Dropdown from "semantic-ui-react/dist/commonjs/modules/Dropdown";

interface IOptions {
    value:string;
    label:string;
}
export default ({name,label,value,onChange,readOnly,error,...otherProps}:IBaseSimpleFormComponent)=>{
    const options:IOptions[] = otherProps && otherProps.options  ? otherProps.options : [];

    if(!!readOnly) {
            const objValue = hasValue(value) ? options.find(object => (object.value === value || object === value)):undefined;
        return (<div key={name}>
            {hasValue(label)?(<label
                style={{
                    padding: 0,
                    fontSize: '1rem',
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 'bold',
                    lineHeight: 1,
                    letterSpacing: '0.00938em',
                }}
            >{label}</label>):null}
            <div style={{color:'#222',padding:5,height:35,marginTop:4,marginBottom:8}}>{(objValue&&objValue.label?objValue.label:(!!objValue?objValue:null) )}</div>
        </div>)
    }

    return (
            <div style={{display:'flex', flexDirection:'column', padding:'0.5rem'}} key={name} >
                {label?<label  style={{
                    fontSize: '1rem',
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 'bold',
                    lineHeight: 1,
                    marginBottom:'1rem',
                    letterSpacing: '0.00938em',
                }} id={label+name}>{label}</label>:null}
                <Dropdown
                    selection
                    key={{name}}
                    id={name}
                    value={value}
                    onChange={(event, data)=>onChange({},{name,value:data.value})}
                    error={!!error}
                    disabled={!!readOnly}
                    {...(_.omit(otherProps,['options']))}
                    options={
                        (options).map(opt=>{
                            return  {
                                key:opt.value||opt,
                                value:opt.value?opt.value:opt,
                                text:opt.label?opt.label:opt
                            }
                        })
                    }

                />

            </div>
    );

}