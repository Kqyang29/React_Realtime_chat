import React, { useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import TimeAgo from "timeago-react";

function ChatMessage({ message }) {
	console.log(message);
		const { currentUser } = useContext(AuthContext);
	const { data } = useContext(ChatContext);

	 const ref = useRef();

		useEffect(() => {
			ref.current?.scrollIntoView({ behavior: "smooth" });
		}, [message]);
	

  return (
		<div
			ref={ref}
			className={`message ${message.senderId === currentUser.uid && "owner"}`}>
			<div className="messageInfo">
				<img
					src={
						message.senderId === currentUser.uid
							? currentUser.photoURL
							: data.user.photoURL
					}
					alt=""
				/>
				<span>
					<TimeAgo datetime={message.date.toDate()} />
				</span>
			</div>

			<div className="messageContent">
				{message.img ? <img src={message.img} alt="" /> : <p>{message.text}</p>}
			</div>
		</div>
	);
}

export default ChatMessage
