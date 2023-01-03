import { doc, onSnapshot } from 'firebase/firestore';
import React, { useContext } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { ChatContext } from '../context/ChatContext';
import { db } from '../firebase';
import ChatMessage from './ChatMessage'

function ChatMessages() {
	const [messages, setMessages] = useState([]);
	const { data } = useContext(ChatContext);

	

	useEffect(() => {
		const unSub = onSnapshot(doc(db, "realtime_chats", data.chatId), (doc) => {
			doc.exists() && setMessages(doc.data().messages);
		});

		return () => {
			unSub();
		};
	}, [data.chatId]);

	// console.log(messages);

  return (
		<div className="chatMessages">
			{messages?.map((message) =>
				<ChatMessage
					key={message.id}
					message={message}
				/>
			)}
			
		</div>
	);
}

export default ChatMessages
