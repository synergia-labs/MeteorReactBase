import React from "react";
import {hasValue} from "/imports/libs/hasValue";


export default ({name,label,value,onChange,readOnly,error,...otherProps}:IBaseSimpleFormComponent)=>{
    const getDateToField = (value:any) => {
        if (hasValue(value)&& typeof (value) === 'object') {
            const dateString = new Date(value).toLocaleDateString()
            const dateSplit = dateString&&dateString.split('/')
            if(dateSplit && dateSplit.length === 3){
                const stringDateUTC = dateSplit[2] + '-' + dateSplit[1]+ '-'+ dateSplit[0]
                return stringDateUTC
            }

        }
    }

    const handleChange = (event:React.BaseSyntheticEvent) => {
        if(event.target.valueAsDate){
            const newDate = new Date(event.target.valueAsDate);
            newDate.setHours(newDate.getHours()+3)
            onChange({}, {name,value:newDate});
        }
    }

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
            <div style={{color:'#222',padding:5,height:35,marginTop:4,marginBottom:8}}>
                {hasValue(value)?new Date(value).toLocaleDateString():null}
            </div>
        </div>)
    }

    return (
        <div style={{display:'flex', flexDirection:'column', padding:'0.5rem'}}>
            {hasValue(label)?(<label
                style={{
                    padding: 0,
                    marginBottom:'1rem',
                    fontSize: '1rem',
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 'bold',
                    lineHeight: 1,
                    letterSpacing: '0.00938em',
                }}
            >{label}</label>):null}
            <input
                type={'Date'}
                style={{border:error? '1px solid red' : undefined}}
                disabled={!!readOnly}
                value={ getDateToField(value) }
                onChange={handleChange}
                {...otherProps}
            />
        </div>
    )
}