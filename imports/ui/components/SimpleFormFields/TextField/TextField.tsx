import React from "react";
import {hasValue} from "/imports/libs/hasValue";
import {Form} from 'semantic-ui-react'


export default ({name,label,value,onChange,readOnly,error,...otherProps}:IBaseSimpleFormComponent)=>{
    if(!!readOnly) {
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
            <div style={{color:'#222',padding:5,height:35,marginTop:4,marginBottom:8}}>{(value+'')}</div>
        </div>)
    }

    return (<Form.Input key={name} onChange={onChange} value={value} error={!!error} disabled={!!readOnly} id={name} name={name} label={label} {...otherProps} />);

}