import React from 'react'
import ChatPeople from '../components/ChatPeople'
import Sidebar from '../components/Sidebar'

function HomePage() {
  return (
    <div className='home'>
      <div className="homeContainer">
        {/* Sidebar */}
        <Sidebar/>
        
        {/* chats */}
        <ChatPeople/>
      </div>
      
    </div>
  )
}

export default HomePage
