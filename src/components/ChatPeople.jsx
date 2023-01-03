import React from 'react'
import add from "../images/add.png";
import more from "../images/more.png";
import cam from "../images/cam.png";
import ChatMessages from './ChatMessages';
import ChatInputBox from './ChatInputBox';
import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
function ChatPeople() {
	const { data } = useContext(ChatContext);

	// console.log(data);

	
  return (
		<div className="ChatPeople">
			<div className="chatPeopleInfo">
				<span>{data.user?.displayName }</span>

				<div className="chatPeopleIcons">
					<img src={cam} alt="" />
					<img src={add} alt="" />
					<img src={more} alt="" />
				</div>
			</div>

			<ChatMessages />
			
			<ChatInputBox/>
		</div>
	);
}

export default ChatPeople;
