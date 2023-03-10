import React, { useCallback, useState } from 'react'
import { Alert, Icon, Input, InputGroup } from 'rsuite'
import InputGroupButton from 'rsuite/lib/InputGroup/InputGroupButton';
// eslint-disable-next-line
const EditableInput = ({initialValue, onSave , label =null, placeholder="write your value", emptyMsg="Input is empty",wrapperClassName="",...inputProps}) => {

    const [input, setInput]=useState(initialValue);
    const [isEditable, setisEditable] = useState(false);

    const onInputChange = useCallback((value)=>{
        setInput(value);
    },[]);

    const onEditClick = useCallback(
      () => {
        setisEditable(p=>!p);
        setInput(initialValue);
          }, [initialValue]);

    const onSaveClick = async ()=>{
        const trimmed= input.trim();
        if (trimmed==='')
        {
            Alert.info(emptyMsg,2000);
        }
        if (trimmed !== initialValue)
        {
            await onSave(trimmed);
        }
        setisEditable(false);
    };

  return (
    <div className={wrapperClassName}>
        {label}
        <InputGroup>
        <Input {...inputProps} disabled={!isEditable} placeholder={placeholder} value={input} onChange={onInputChange}/>
        <InputGroupButton onClick={onEditClick}>
            <Icon icon={isEditable?'close':'edit2'}/>
        </InputGroupButton>
        {isEditable && 
        (<InputGroupButton onClick={onSaveClick}>
            <Icon icon="check"/>
        </InputGroupButton>)
        }
        </InputGroup>
    </div>
  )
}

export default EditableInput;