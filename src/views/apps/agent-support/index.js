// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Chat App Component Imports
import Chat from './Chat'
import Sidebar from './SidebarLeft'
import UserProfileSidebar from './UserProfileSidebar'

// ** Third Party Components
import classnames from 'classnames'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile, getChatContacts } from './store/actions'

import '@styles/base/pages/app-chat.scss'
import '@styles/base/pages/app-chat-list.scss'

const AgentSupport = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.chat)

  // ** States
  const [user, setUser] = useState({})
  const [sidebar, setSidebar] = useState(false)
  const [userSidebarRight, setUserSidebarRight] = useState(false)
  const [userSidebarLeft, setUserSidebarLeft] = useState(false)

  // ** Sidebar & overlay toggle functions
  const handleSidebar = () => setSidebar(!sidebar)
  const handleUserSidebarLeft = () => setUserSidebarLeft(!userSidebarLeft)
  const handleUserSidebarRight = () => setUserSidebarRight(!userSidebarRight)
  const handleOverlayClick = () => {
    setSidebar(false)
    setUserSidebarRight(false)
    setUserSidebarLeft(false)
  }

  // ** Set user function for Right Sidebar
  const handleUser = obj => setUser(obj)

  // ** Get data on Mount
  useEffect(() => {
    dispatch(getChatContacts())
    dispatch(getUserProfile())
  }, [dispatch])

  return (
    <Fragment>
      <div style={{width: '100%'}}>
        <div className='content-wrapper'>
          <div className='content-body'>
            <Chat
              store={store}
              handleUser={handleUser}
              handleSidebar={handleSidebar}
              userSidebarLeft={userSidebarLeft}
              handleUserSidebarRight={handleUserSidebarRight}
            />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default AgentSupport
