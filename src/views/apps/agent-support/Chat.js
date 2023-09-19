// ** React Imports
import { useState, useEffect, useRef, Fragment } from 'react'
import ReactDOM from 'react-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Store & Actions
import { useDispatch } from 'react-redux'
import { sendMsg } from './store/actions'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { MessageSquare, Menu, PhoneCall, Video, Search, MoreVertical, Mic, Image, Send } from 'react-feather'
import AwsContactInfo from './contact_response.json'
const DialogTranscript = JSON.parse(JSON.parse(AwsContactInfo.metadata)).transcription
import AgentAvatar from '@src/assets/images/portrait/small/avatar-s-4.jpg'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Form,
  Label,
  InputGroup,
  InputGroupAddon,
  Input,
  InputGroupText,
  Button
} from 'reactstrap'
import { formatDateTime } from '../../../utility/Utils'

const ChatLog = props => {
  // ** Props & Store
  const { handleUser, handleUserSidebarRight, handleSidebar, store, userSidebarLeft } = props
  const { userProfile, selectedUser } = store
  const [chatLog, setChatLog] = useState(DialogTranscript)

  // ** Refs & Dispatch
  const chatArea = useRef(null)
  const dispatch = useDispatch()

  // ** State
  const [msg, setMsg] = useState('')

  // ** Scroll to chat bottom
  const scrollToBottom = () => {
    const chatContainer = ReactDOM.findDOMNode(chatArea.current)
    chatContainer.scrollTop = Number.MAX_SAFE_INTEGER
  }

  // ** If user chat is not empty scrollToBottom
  useEffect(() => {
    scrollToBottom()
  }, [chatLog])

  // ** Formats chat data based on sender
  const formattedChatData = () => {
    const formattedChatLog = []
    let chatMessageSenderId = chatLog[0].ParticipantId
    let msgGroup = {
      senderId: chatMessageSenderId,
      messages: []
    }
    chatLog.forEach((msg, index) => {
      if (chatMessageSenderId === msg.ParticipantId) {
        msgGroup.messages.push({
          msg: msg.Content,
          time: formatDateTime(AwsContactInfo.start_date_time, msg.BeginOffsetMillis)
        })
      } else {
        chatMessageSenderId = msg.ParticipantId
        formattedChatLog.push(msgGroup)
        msgGroup = {
          senderId: msg.ParticipantId,
          messages: [
            {
              msg: msg.Content,
              time: formatDateTime(AwsContactInfo.start_date_time, msg.BeginOffsetMillis)
            }
          ]
        }
      }
      if (index === chatLog.length - 1) formattedChatLog.push(msgGroup)
    })
    return formattedChatLog
  }

  // ** Renders user chat
  const renderChats = () => {
    return formattedChatData().map((item, index) => {
      return (
        <div
          key={index}
          className={classnames('chat', {
            'chat-left': item.senderId === 'AGENT'
          })}
        >
          <div className='chat-avatar'>
            <Avatar
              className='box-shadow-1 cursor-pointer'
              img={item.senderId === 'AGENT' ? AgentAvatar : userProfile.avatar}
            />
          </div>

          <div className='chat-body'>
            {item.messages.map(chat => (
              <Fragment>
                <div key={chat.msg} className='chat-content'>
                  <p>{chat.msg}</p>
                </div>
                <div key={`${chat.msg}_datetime`} className='chat-datetime'>
                  <p>{chat.time}</p>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      )
    })
  }

  // ** Opens right sidebar & handles its data
  const handleAvatarClick = obj => {
    handleUserSidebarRight()
    handleUser(obj)
  }

  // ** On mobile screen open left sidebar on Start Conversation Click
  const handleStartConversation = () => {
    if (!Object.keys(selectedUser).length && !userSidebarLeft && window.innerWidth <= 1200) {
      handleSidebar()
    }
  }

  // ** Sends New Msg
  const handleSendMsg = e => {
    e.preventDefault()
    if (msg.length) {
      setChatLog(chatLog => [...chatLog, { ParticipantId: 'CUSTOMER', Content: msg }])
      setMsg('')
    }
  }

  // ** End Chat and Clear all
  const handleEndChat = e => {
    e.preventDefault()
    setChatLog([])
    setMsg('')
  }

  // ** ChatWrapper tag based on chat's length
  const ChatWrapper = PerfectScrollbar

  return (
    <div className='chat-app-window'>
      <div className={classnames('active-chat')}>
        <div className='chat-navbar'>
          <header className='chat-header'>
            <div className='d-flex align-items-center'>
              <div className='sidebar-toggle d-block d-lg-none mr-1'>
                <Menu size={21} />
              </div>
              <Avatar
                imgHeight='36'
                imgWidth='36'
                img={userProfile.avatar}
                status={'online'}
                className='avatar-border user-profile-toggle m-0 mr-1'
              />
              <h6 className='mb-0'>{'Agent'}</h6>
            </div>
          </header>
        </div>

        <ChatWrapper ref={chatArea} className='user-chats' options={{ wheelPropagation: false }}>
          {chatLog && chatLog.length && <div className='chats'>{renderChats()}</div>}
        </ChatWrapper>

        <Form className='chat-app-form' onSubmit={handleSendMsg}>
          <InputGroup className='input-group-merge mr-1 form-send-message'>
            <InputGroupAddon addonType='prepend'>
              <InputGroupText>
                <Mic className='cursor-pointer' size={14} />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              value={msg}
              onChange={e => setMsg(e.target.value)}
              placeholder='Type your message or use speech to text'
            />
            <InputGroupAddon addonType='append'>
              <InputGroupText>
                <Label className='attachment-icon mb-0' for='attach-doc'>
                  <Image className='cursor-pointer text-secondary' size={14} />
                  <input type='file' id='attach-doc' hidden />
                </Label>
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <Button className='send' color='primary' onClick={handleSendMsg}>
            <Send size={14} className='d-lg-none' />
            <span className='d-none d-lg-block'>Send</span>
          </Button>
          <Button className='clear' color='danger' onClick={handleEndChat} style={{marginLeft: '.5rem'}}>
            <Send size={14} className='d-lg-none' />
            <span className='d-none d-lg-block'>End</span>
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default ChatLog
