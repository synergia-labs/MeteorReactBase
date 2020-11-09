import React from "react";
import FileInputComponent from 'react-file-input-previews-base64'
import {Image,Form} from "semantic-ui-react";
import {hasValue} from "../../../libs/hasValue";
import { Button } from 'semantic-ui-react'


export default ({name,label,value,onChange,readOnly,error})=>{

    const onFileSelect=(fileData)=>{
        let imgValue;
        if(fileData) {
            if(Array.isArray(fileData)) {
                imgValue = fileData[0].base64;
            } else {
                imgValue = fileData.base64;
            }
            console.log({},{name,value:imgValue});
            onChange({},{name,value:imgValue})
        }
    }

    if(!!readOnly) {
        return (<>
            {hasValue(label)?(<label>{label}</label>):null}
            <Image src={value} size={'medium'}/>
        </>)
    }

    return (<>
        {hasValue(label)?(<label>{label}</label>):null}
        <FileInputComponent
            defaultFiles={hasValue(value)?[value]:undefined}
            labelText={""}
            name={name}
            labelStyle={{fontSize:14}}
            multiple={false}
            callbackFunction={onFileSelect}
            accept="image/*"
            buttonComponent={<a style={{cursor:'pointer'}}>{'Selecionar imagem'}</a>}
        />
        </>
    );

}