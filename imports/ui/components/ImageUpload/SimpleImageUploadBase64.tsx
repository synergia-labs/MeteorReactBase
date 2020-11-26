import React from "react";
// @ts-ignore
import FileInputComponent from 'react-file-input-previews-base64'
import {Image} from "semantic-ui-react";
import {hasValue} from "../../../libs/hasValue";


export default ({name,label,value,onChange,readOnly,error}:IBaseSimpleFormComponent)=>{

    const onFileSelect=(fileData:any)=>{
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
    const deleteImage = () => {
        onChange({},{name,value: '-'})
    }

    return (<>
        {hasValue(label)?(<label>{label}</label>):null}
        <i  style={{cursor: 'pointer'}} className="trash icon"/>
        <FileInputComponent
            defaultFiles={hasValue(value)?[value]:undefined}
            labelText={""}
            name={name}
            parentStyle={{border: error? '1px solid red':undefined}}
            labelStyle={{fontSize:14}}
            multiple={false}
            callbackFunction={onFileSelect}
            accept="image/*"
            buttonComponent={<a style={{cursor:'pointer'}}>{'Selecionar imagem'}</a>}
        />
        </>
    );

}