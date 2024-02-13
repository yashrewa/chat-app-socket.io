import './App.css'
import { useEffect, useState } from 'react'

import * as io from 'socket.io-client'



const socket = io.connect('https://chat-app-backend-s5js.onrender.com')
function App() {
  const [sentMessage, setsentMessage] = useState<string>('')
  const [allMessages, setAllMessages] = useState<{ userId?: string; message: string, type: string }[]>([])
  const sendMessage = () => {
    const trimBlankSpaces = sentMessage.trim();
    if (trimBlankSpaces !== '') {

      socket.emit("message", { sentMessage })
      setAllMessages(prev => [...prev, { message: sentMessage, type: 'sent' }]);
      setsentMessage('')
    }

  }

  useEffect(() => {
    socket.on('response', (data) => {
      setAllMessages(prev => [...prev, { userId: data.userId, message: data.sentMessage, type: 'received' }]);
    })
  }, [socket])
  return (
    <div>
      <div className='leading-loose text-2xl flex justify-center bg-gray-100 w-screen'>CHAT ROOM</div>
      <div className='flex flex-col items-center  w-screen min-h-screen bg-gray-100 text-gray-800 '>
        <div className='flex flex-col items-center  w-screen min-h-screen bg-gray-100 text-gray-800 p-6'>
          <div className='flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden'>
            <div className='flex flex-col flex-grow h-0 p-4 overflow-auto'>
              {allMessages.length !== 0 ? allMessages?.map((messages) => {
                return (<div key={Math.random()}>
                  <div className={`flex w-full mt-2 space-x-3 max-w-xs${messages.type === 'sent' ? 'ml-auto justify-end' : ''}`}>
                    {messages.type === 'received' && messages.userId && <div className="flex-col text-wrap text-center pt-2 font-bold text-gray-600 text-base h-10 w-10 rounded-full bg-gray-300">{messages?.userId.charAt(0).toUpperCase()}</div>}
                    <div>
                      <div className={` p-3 ${messages?.type === 'sent' ? 'bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg' : 'bg-gray-300 rounded-r-lg rounded-bl-lg'}`}>
                        <p className="text-sm">{messages?.message}</p>
                      </div>
                    </div>
                    {messages?.type === 'sent' && <div className="flex-shrink-0 text-base text-center pt-2 font-semibold text-gray-600 h-10 w-10 rounded-full bg-gray-300">A</div>}
                  </div>
                </div>)
              }):(<div className='text-pretty text-center text-gray-400'>Start Broadcasting the messages</div>)}
            </div>
            <div className='fixed bottom-0 left-0 right-0'>
              <div className="flex items-center px-3 py-2 md:mx-12 rounded-xl bg-gray-100">
                <textarea id="chat" value={sentMessage}
                  rows={1} onChange={(e) => {
                    setsentMessage(e.target.value)
                  }} className="block h-auto mx-4 p-2.5 w-full text-base text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 " placeholder="Your message..."></textarea>
                <button onClick={sendMessage} className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100">
                  <svg className="w-5 h-5 rotate-90 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                    <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                  </svg>
                  <span className="sr-only">Send message</span>
                </button>
              </div>
            </div >
          </div >
        </div>
      </div>
    </div>
  )
}

export default App
