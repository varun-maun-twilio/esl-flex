import { useEffect, useState, useRef } from 'react';
import * as TwilioFlex from '@twilio/flex-ui';
import {
  Label,
  Input,
  Button,
  Heading,
  Stack,
  Checkbox,
  Combobox,
  Flex
} from "@twilio-paste/core";
import { Box } from '@twilio-paste/core/box';
import { Modal, ModalBody, ModalFooter, ModalFooterActions, ModalHeader, ModalHeading } from '@twilio-paste/core/modal';
import { AlertDialog } from '@twilio-paste/core/alert-dialog';
import { Spinner } from "@twilio-paste/core";
import { LoadingIcon } from "@twilio-paste/icons/esm/LoadingIcon";
import { DatePicker, formatReturnDate } from '@twilio-paste/core/date-picker';
import moment from 'moment';
import {
  SideModal,
  SideModalBody,
  SideModalButton,
  SideModalContainer,
  SideModalHeader,
  SideModalHeading,
  useSideModalState,
} from '@twilio-paste/core/side-modal';
import { MessagingCanvas } from '@twilio/flex-ui';
import TaskSearchService from '../../utils/TaskSearchService';


import * as St from "./TaskSearchViewStyles";


import "./styles.css"



const FILTER_MAP = {
  "channel": 'label.conversations.communication_channel',
  "email": 'label.customers.email_label',
  "externalContact": 'label.conversations.external_contact'
}

const TaskSearchView = () => {

  const chatDialog = useSideModalState({});
  const [selectedConversationSid,setSelectedConversationSid] = useState(null);

  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [insightsToken, setInsightsToken] = useState<string>("");

  const [searchResults, setSearchResults] = useState<any>({});
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [externalContactInput, setExternalContactInput] = useState("");
  const [customerContactInput, setCustomerContactInput] = useState("");
  const [conversationSidInput, setConversationSidInput] = useState("");
  const [channelInput, setChannelInput] = useState("Call");




  const fetchToken = async () => {
    const insightsTokenResponse = await TaskSearchService.fetchToken();
    const token = insightsTokenResponse.tempToken;
    setInsightsToken(token);

  }


  useEffect(() => {
    let timeoutId:any;

    const fetchData = async () => {
      try {
        await fetchToken();
      } catch (err) {
        console.error('Polling error:', err);
      } finally {
        // Schedule the next poll after a delay
        timeoutId = setTimeout(fetchData, 120*1000); 
      }
    };

    fetchData(); 

    return () => {
      clearTimeout(timeoutId); 
    };
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {

  }, [insightsToken]);


  useEffect(()=>{
    //Do Nothing
  },[selectedConversationSid]);


  const executeSearch = async () => {

    const searchPayoad = {
      startDate,
      endDate,
      externalContactInput,
      customerContactInput,
      conversationSidInput,
      channelInput
    }

    console.error(searchPayoad);

    setShowLoading(true);


    const filterIdentifierResponse = await TaskSearchService.getFilterIdentifiers(insightsToken);
    const filterIdMap = filterIdentifierResponse?.filterIdentifiers.reduce(function (map: any, obj: any) {
      map[obj.identifier] = obj.uri;
      return map;
    }, {});


    const filterObj: any = {};

    //Filter for channel
    if (channelInput != null) {
      filterObj[filterIdMap['label.conversations.communication_channel']] = channelInput;
    }

    //Filter for date range
    const listOfDates = [];
    var firstDate = moment(startDate).startOf('day');
    var lastDate = moment(endDate).startOf('day');
    listOfDates.push(firstDate.clone().format("YYYY-MM-DD"));
    while(firstDate.add(1, 'days').diff(lastDate) <= 0) {
      listOfDates.push(firstDate.clone().format("YYYY-MM-DD"));
    }    
    filterObj[filterIdMap['date.date.yyyymmdd']] =listOfDates;

    //Filter for external contact
    if (externalContactInput != null && externalContactInput.trim().length > 0) {
      filterObj[filterIdMap['label.conversations.external_contact']] = encodeURIComponent(externalContactInput.trim());
    }

    //Filter for customer contact
    if (customerContactInput != null && customerContactInput.trim().length > 0) {
      if (channelInput === "email") {
        filterObj[filterIdMap['label.customers.email_label']] = encodeURIComponent(customerContactInput.trim());
      }
      else {
        filterObj[filterIdMap['label.customers.phone_label']] = encodeURIComponent(customerContactInput.trim());
      }

    }

     //Filter for conversation Sid
    if (conversationSidInput != null && conversationSidInput.trim().length > 0) {
      filterObj[filterIdMap['label.conversations.conversation_label_2']] = encodeURIComponent(conversationSidInput.trim());
    }



    const filterResponse = await TaskSearchService.getFilterValues(insightsToken, filterObj);
    const filterMap = filterResponse?.filterMap;

    let taskResults: any[] = [];

    taskResults = await TaskSearchService.searchTasks(insightsToken, filterMap);

    setSearchResults(taskResults);
    setShowLoading(false);

  }

  const clearForm = () => {
    setStartDate(moment().format('YYYY-MM-DD'));
    setEndDate(moment().format('YYYY-MM-DD'));
    setExternalContactInput("");
    setCustomerContactInput("");
    setChannelInput("Call");
    setConversationSidInput("");
    setSearchResults([]);
  }



  if(insightsToken==""){
    return null;
  }


  return (

    <St.TaskSearchViewViewWrapper>

      <Flex margin="space50" marginBottom="space0" element="EMAIL_SEARCH_VIEW_WRAPPER" vertical grow shrink >


        <Heading as="h2" variant="heading20" >
          Task Search
        </Heading>


        <St.SearchTasksTable>

          <tbody>
            <tr>

              <td >
                <Label htmlFor="search-email-fromDate" >
                  Start Date
                </Label>
                <DatePicker id={"search-email-fromDate"} value={startDate} onChange={(evt) => setStartDate(evt.target.value)} />

              </td>
              <td >
              <Label htmlFor="search-email-toDate" >
                  End Date
                </Label>
                <DatePicker id={"search-email-toDate"} value={endDate} 
                onChange={(evt) => setEndDate(evt.target.value)} 
                min={startDate}
                max={moment(startDate).add(15,'d').format("YYYY-MM-DD")}
               />

              </td>
              <td>
                <Combobox
                  autocomplete
                  items={[ "Call", "Chat", "SMS","video","email"]}
                  labelText="Select Channel"
                  selectedItem={channelInput}
                  onSelectedItemChange={changes => {
                    setChannelInput(changes.selectedItem);
                  }}
                />
              </td>

              <td >
                <Label htmlFor={"search-external-contact"}>External Contact:</Label>
                <Input
                  type="text"
                  id="search-external-contact"
                  name="search-external-contact"
                  placeholder="External Contact"
                  value={externalContactInput}
                  onChange={e => setExternalContactInput(e.target.value)}
                />
              </td>
              <td >

                <Label htmlFor={"search-customer-contact"}>Customer Contact:</Label>
                <Input
                  type="text"
                  id="search-customer-contact"
                  name="search-customer-contact"
                  placeholder="Customer Contact"
                  value={customerContactInput}
                  onChange={e => setCustomerContactInput(e.target.value)}
                />
              </td>
              <td >
                <Label htmlFor={"search-conversationsid"}>Conversation Sid:</Label>
                <Input
                  type="text"
                  id="search-conversationsid"
                  name="search-conversationsid"
                  placeholder="Conversation Sid"
                  value={conversationSidInput}
                  onChange={e => setConversationSidInput(e.target.value)}
                />
              </td>
              <td className="btn">
                <Button variant="primary" onClick={executeSearch} >Search</Button>
              </td>
              <td className="btn">
                <Button variant="secondary" onClick={clearForm}>Reset</Button>
              </td>
            </tr>
          </tbody>
        </St.SearchTasksTable>



        {
          (showLoading || insightsToken == null) && (
            <Flex hAlignContent="center" vertical padding="space60" width="100%">
              <Spinner size="sizeIcon110" decorative={false} title="Loading" />
            </Flex>)
        }


        <St.SearchResultsTable>
          <thead>
            <tr>
              <th>Date Time</th>
              <th>Channel</th>
              <th>Conversation Sid</th>
              <th>External Contact</th>
              <th>Customer Contact</th>
              <th>Agent</th>
            </tr>
          </thead>
          <tbody>
            {searchResults?.rows?.map((message: any, index: number) => (
              <tr key={message.segment} className={(index % 2 === 0 ? 'even-row ' : 'odd-row ')}>
                <td>{message.date} {message.time}</td>
                <td>
                  {message.channel}
                </td>
                <td>
                  {
                    ( message.channel !== "Call" && message.channel !== "video" ) &&
                    <a href="#" onClick={() => {
                      setSelectedConversationSid(message?.conversationSid);
                      chatDialog.show();
                   // TwilioFlex.Actions.invokeAction("InsightsPlayerPlay", { segmentId: message.segment });
                  }}>{message.conversationSid}</a>
                  }
                  {
                    (message.channel === "Call" || message.channel === "video") &&
                    <p>{message.conversationSid || ""}</p>
                  }

                </td>

                <td>
                  {message.externalContact}
                </td>

                <td>
                  {message.customerContact}
                </td>

                <td>
                  {message.agent}
                </td>

              </tr>
            ))}
          </tbody>
        </St.SearchResultsTable>





      </Flex>
      <Box display="flex" flexDirection="column" rowGap="space70">
      <Box>
        <SideModalContainer state={chatDialog}>
          <SideModal aria-label="Basic Side Modal">
            <SideModalHeader>
              <SideModalHeading>
                Transcript
              </SideModalHeading>
            </SideModalHeader>
            <SideModalBody>
              
              <Box className="custom-chat-wrapper" key="custom-chat-wrapper-component" style={{ height: 600, minHeight: 600 }}>

          {/* <Heading>Hello CRM</Heading> */}

{selectedConversationSid &&
          <MessagingCanvas key="conversation-messaging-canvas" sid={selectedConversationSid} conversationType={(channelInput === "email")?"email":"chat"} autoInitConversation={true}>
            </MessagingCanvas>
}
{!selectedConversationSid && 
<p>No Transcript Found</p>}


        </Box>
              
            </SideModalBody>
          </SideModal>
        </SideModalContainer>
      </Box>
     
    </Box>
    </St.TaskSearchViewViewWrapper>
  );
};

export default TaskSearchView;
