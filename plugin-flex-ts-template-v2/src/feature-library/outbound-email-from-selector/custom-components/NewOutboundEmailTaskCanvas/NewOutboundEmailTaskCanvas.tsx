import React, { useEffect, useState, useMemo } from 'react';
import * as Flex from '@twilio/flex-ui';
import {Combobox} from '@twilio-paste/core/combobox';
import {Input} from '@twilio-paste/core/input';
import {Label} from '@twilio-paste/core/label';
import {HelpText} from '@twilio-paste/core/help-text';
import {Button} from '@twilio-paste/core/button';
import {
    Form,
    FormSection,
    FormSectionHeading,
    FormControl
  } from '@twilio-paste/core/form';
  import * as St from "./StyledComponents"; 

import NewOutboundEmailTaskService from "../../utils/NewOutboundEmailTaskService";

interface Props {
   
  }

  const NewOutboundEmailTaskCanvas = ({  }: Props) => {


    const [selectedFrom,setSelectedFrom] = useState<any | null>(null);
    const [selectedTo,setSelectedTo] = useState<string | null>("");
    const [selectedQueue,setSelectedQueue] = useState<any | null>(null);

    const [emailList,setEmailList] = useState<any []>([]);
    const [emailFromInputItems, setEmailFromInputItems] = React.useState(emailList);


    const [selectedFromInvalid,setSelectedFromInvalid] = useState<boolean>(false);
    const [selectedToInvalid,setSelectedToInvalid] = useState<boolean>(false);
    const [selectedQueueInvalid,setSelectedQueueInvalid] = useState<boolean>(false);

    const fetchEmailList = async ()=>{
       const configuredEmailOptions = await NewOutboundEmailTaskService.fetchEmailList();
       //console.error(configuredEmailOptions);
       setEmailList(configuredEmailOptions);
    }

    useEffect(()=>{
        fetchEmailList();
    },[])

    useEffect(()=>{
        //Do Nothing
    },[emailList]);

    const isValidEmail = (inputString:string)=>{
        const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(inputString).toLowerCase());
    }

    const handleNewTaskBtnClick = ()=>{

        let hasValidationErrors = false;

        //1. Validate from
        if(selectedFrom==null){
            hasValidationErrors = true;
            setSelectedFromInvalid(true);
        }

        //2. Validate to
        if(selectedTo==null || selectedTo.trim().length==0 || !isValidEmail(selectedTo)){
            hasValidationErrors = true;
            setSelectedToInvalid(true);
        }


        //3. Extract Queue
       //console.error(emailList);
        const queueSid = emailList.filter((q:any)=>q["value"]===selectedFrom.value)[0].queueSid;

        //4. Create new task

        console.error("Selected From",selectedFrom);

        if(!hasValidationErrors){
            Flex.Actions.invokeAction("StartOutboundEmailTask", {
                destination: selectedTo,
                queueSid:queueSid,
                from:selectedFrom.value ,
                fromName: "ESL",
                taskAttributes:{
                  "conversations":{
                    "external_contact" : selectedFrom.label
                },
                "customers" : {
                    "email" : selectedTo
                }
                }
              });
        }

        //5. Remove the new task canvas form 
        Flex.Manager.getInstance().store.dispatch({ type: 'WORKER_DELETE_RESERVATION', payload: { sid: "new" } });

    }

 
    return (
        <St.FormWrapper>
    


        <Form >  

        <FormControl>
  <Combobox
    autocomplete
    items={emailList}
    labelText="Select From Email Address"
    optionTemplate={(item) => (<span>{item.label}</span>)}
    itemToString={item => (item ? String(item.label) : "")}
    selectedItem={selectedFrom}
        onSelectedItemChange={changes => {
            setSelectedFrom(changes.selectedItem);
        }}
  />
  {
        selectedFromInvalid && <HelpText variant="error" >Please Select the From Email Address</HelpText>
    }

</FormControl>
<FormControl>
    <Label htmlFor="email-to" required>
      Enter To Email Address
    </Label>
    <Input  type="email" value={selectedTo || ""} 
            placeholder="abc@gmail.com" 
            onChange={(e)=>setSelectedTo(e.target.value)} 
            hasError={selectedToInvalid}
            required />
    {
        selectedToInvalid && <HelpText variant="error" >Please enter a valid To Email Address</HelpText>
    }
  </FormControl>


<FormControl>
<Button variant="primary" onClick={()=>handleNewTaskBtnClick()}>
  Start
</Button>
</FormControl>

</Form>


</St.FormWrapper>
    )


  };

export default NewOutboundEmailTaskCanvas;