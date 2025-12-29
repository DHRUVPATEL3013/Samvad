import { useEffect, useRef, useState } from "react"
import axios from "axios";
import AddContact from "./addContact";
import "./chatt.css";
import SendMsg from "./sendmessage";
import MyContacts from "./mycontacts";
import Profile from "./profile";
import {  useNavigate } from "react-router-dom";
import SendMedia from "./SendMedia";
import ChatInput from "./ChatInput";
import { API_BASE, WS_BASE } from "../config";

function Chatt() {
  
  const navigate=useNavigate()
const chatEndRef = useRef(null);

  const [ws, setWs] = useState(null)
  
  const [message, setMessage] = useState([])
   const [contacts,setContacts]=useState([])
   const [msgStatus,setMsgStatus] = useState("")
  
  const [chat, setChat] = useState([])
  const [activeTab, setActiveTab] = useState("chats")
  const [activeChat, setActiveChat] = useState(null)

  const [profileData,setProfileData]=useState("")
  const token = localStorage.getItem("token");
  const phone = localStorage.getItem("phone")


  const scrollToBottom = () => {
  if (chatEndRef.current) {
    chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
};

  useEffect(() => {
    const socket = new WebSocket(`${WS_BASE}?token=${token}`);
    setWs(socket)
    socket.onopen = () => console.log("✅ WebSocket connected");
    socket.onmessage = async (event) => {
      const wsData = JSON.parse(event.data)
    
      
      if (wsData.type === "message") {
        const newMessage = wsData.data
        console.log(newMessage.id)
        setMessage((prev) => [...prev, newMessage])
        // setMsgStatus(wsData.status)
        if (activeChat === newMessage.sender) {
      await axios.put(
        `${API_BASE}/messages/read/${newMessage.sender}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }
        
      }
       if (wsData.type === "delivered") {
    const msgID = wsData.id

    setMessage((prev) =>
      prev.map((msg) =>
        msg.id === msgID ? { ...msg, status: "delivered" } : msg
      )
    )
  }
  if (wsData.type === "read") {
    setMessage(prev =>
      prev.map(msg =>
        msg.sender === phone
          ? { ...msg, status: "read" }
          : msg
      )
    );
  }
      
    }
    socket.onclose = () => { console.log("webscoket disconneted") }
    return () => socket.close()
  }, [])


  const getProfileData= async()=>{
    const res=await axios.get(`${API_BASE}/get-profile`,
            {headers:{Authorization:`Bearer ${token}`}}
        )
    setProfileData(res.data)
  }


  const fetchMessage = async (peers) => {
    const res = await axios.get(`${API_BASE}/messages/${peers}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    console.log(res.data)
    setMessage(res.data)
    setActiveChat(peers)
    getChats()
    
    await axios.put(
    `${API_BASE}/messages/read/${peers}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  }

  useEffect(() => {
  scrollToBottom();
}, [message]);

 
  
      const fetchContacts=async()=>{
          const res=await axios.get(`${API_BASE}/my-contacts`,
              {
                  headers:{Authorization:`Bearer ${token}`}
              }
          )
          console.log(res.data)
          setContacts(res.data)
      }
      
  const updateName = async (id, newName) => {
    const res = await axios.put(`${API_BASE}/update-contact-name/${id}`, null,
      {
        params: {
          new_name: newName
        },
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    getChats()
  }

  const getChats = async () => {
    const res = await axios.get(`${API_BASE}/chats`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    // console.log("hello")
    // console.log(res.data)
    setChat(res.data)
  }

  useEffect(() => {
    console.log(message.length)
    if (token) getChats(),getProfileData()
      
      
  }, [token])

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  

  const ChatIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
  );
  const StatusIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"/></svg>
  );
  const SettingsIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.58 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
  );

  return (
    <div className="chat-container">
      {/* Sidebar */}
      {/*<div className="sidebar-header">
        <h2>QuickChat</h2>
          <p>Fast and secure messaging</p>

          <Profile/> 
          <div className="profile-pic" onClick={()=>navigate("/profile")}>
            {profileData?.profile_pic?<img src={`${API_BASE}/${profileData.profile_pic}`} alt="no image" />:profileData?.fullname?profileData.fullname.charAt(0).toUpperCase():""}

            <h3>{profileData.fullname}</h3>
            
          </div>
          
        </div> */}

        <div className="nav-rail">
         <div className="logo">
           
            <img src="./src/assets/app-logo.png" alt="no image bhai" />

         </div>
          
            
          
        <div className="nav-profile-wrapper" onClick={() => navigate("/profile")}>
          
           
             {profileData?.profile_pic ? (
                // <img src={`http://127.0.0.1:8000/${profileData.profile_pic}`} alt="Profile" />
                <img src={profileData.profile_pic} alt="Profile" />
              ) : (
                <div className="nav-profile-placeholder">
                    {profileData?.fullname ? profileData.fullname.charAt(0).toUpperCase() : "U"}
                </div>
              )}
        </div>

        <div className="nav-icons-container">
            <div className={`nav-icon-btn ${activeTab === 'chats' ? 'active' : ''}`} title="Chats">
                <ChatIcon />
            </div>
            <div className="nav-icon-btn" title="Status">
                <StatusIcon />
            </div>
            <div className="nav-icon-btn bottom-icon" title="Settings">
                <SettingsIcon />
            </div>
        </div>
      </div>
        
      <div className="sidebar">
        
        <div className="sidebar-tabs">
          <div 
            className={`sidebar-tab ${activeTab === "chats" ? "active" : ""}`}
            onClick={() => setActiveTab("chats")}
          >
            Chats
          </div>
          <div 
            className={`sidebar-tab ${activeTab === "contacts" ? "active" : ""}`}
            onClick={() => setActiveTab("contacts")}
          >
            Contacts
          </div>
        </div>
        
        <div className="sidebar-content">
          {activeTab === "chats" && (
            <div className="chat-list">
              {chat.map((c, index) => (
                <div 
                  key={index} 
                  className="chat-item"
                  onClick={() => {fetchMessage(c.phone),setTimeout(scrollToBottom, 100);}}
                >
                  <div className="chat-avatar">

                    {/* {c.profile_pic?<img style={{width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover"}} src={`http://127.0.0.1:8000/${c.profile_pic}`} alt="no image" />:c.saved_name ? c.saved_name.charAt(0).toUpperCase() : c.phone.charAt(0)} */}
                    {c.profile_pic?<img style={{width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover"}} src={c.profile_pic} alt="no image" />:c.saved_name ? c.saved_name.charAt(0).toUpperCase() : c.phone.charAt(0)}
                  </div>
                  <div className="chat-info">
                    <div className="chat-name">
                      {c.saved_name ? c.saved_name : c.phone}
                      <button 
                        className="edit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newName = prompt("Enter new name: ", c.saved_name || c.phone);
                          if (newName) {
                            updateName(c.id, newName)
                          }
                        }}
                      >
                      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12.5" cy="6" r="2" fill="currentColor"/>
  <circle cx="12.5" cy="12.5" r="2" fill="currentColor"/>
  <circle cx="12.5" cy="19" r="2" fill="currentColor"/>
</svg>
                      </button>
                    </div>
                    <div className="chat-last-message">{c.last_msg}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === "contacts" && (
            <MyContacts token={token} getMsg={fetchMessage} fetchChat={getChats} fetchCont={fetchContacts} contacts={contacts} />
          )}
        </div>
        
        <AddContact token={token} fetchCont={fetchContacts} />
      </div>

      {/* Main Chat Area */}
      <div className="chat-area">
        {activeChat ? (
          <>
            <div className="chat-header">
              <div className="chat-avatar">
                {(() => {
                  const chatUser = chat.find(c => c.phone === activeChat);
                  return chatUser?.profile_pic ? (
                    <img 
                      // src={`http://127.0.0.1:8000/${chatUser.profile_pic}`} 
                      src={chatUser.profile_pic} 
                      alt="Profile" 
                      style={{width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover"}}
                    />
                  ) : (
                    activeChat.charAt(0).toUpperCase()
                  );
                })()}
              </div>
              <div className="chat-header-info">
                <div className="chat-header-name">
                  {chat.find(c => c.phone === activeChat)?.saved_name || activeChat}
                </div>
                <div className="chat-header-status">Online</div>
              </div>
            </div>
            
            <div className="chat-messages">
              {message.map((m, index) => (
                <div 
                  key={index} 
                  className={`message ${m.sender === phone ? "message-sent" : "message-received"}`}
                >
              
                  <div className="message-content">
                    {m.media_url ? (
                      <div className="media-message">
                        {m.media_type && m.media_type.startsWith('image/') ? (
                          <img 
                            // src={`http://127.0.0.1:8000${m.media_url}`} 
                            src={m.media_url} 
                            alt="Media" 
                            className="message-image" 
                          />
                          
                          
                        ) : (
                          <div className="file-message">
                            <span className="file-icon">📎</span>
                            <a 
                              href={`${API_BASE}${m.media_url}`} 
                              download 
                              className="file-link"
                            >
                              {m.media_url.split('/').pop()}
                            </a>
                          </div>
                        )}
                        {m.content && <div className="media-caption">{m.content}</div>}
                                         <a
      href={`${API_BASE}${m.media_url}`}
      download
      className="download-btn"
      title="Download"
    >
      <img src="https://maxst.icons8.com/vue-static/icon/svg/arrowDown.svg" alt="" />
    </a>
                      </div>
                    ) : (
                      m.content
                    )}
    
                  </div>
                  {/* <div className="message-time"><p> </p>{formatTime(m.timestamp)}</div> */}
                  <div className="message-time">
  {formatTime(m.timestamp)}

  {m.sender === phone && (
    <span style={{ marginLeft: "6px", fontSize: "12px" }}>
      {m.status === "sent" && "✓"}
      {m.status === "delivered" && "✓✓"}
      {m.status === "read" && <span style={{ color: "dodgerblue" }}>👁️</span>}
    </span>
  )}
</div>

                </div>
              ))}
                <div ref={chatEndRef}></div>
            </div>
            {/* <SendMedia token={token} recipient={activeChat} getchats={getChats} />
            <SendMsg token={token} recipient={activeChat} getchats={getChats}  /> */}
            <ChatInput
  token={token}
  recipient={activeChat}
  getchats={getChats}
/>

          </>
        ) : (
          <div className="chat-messages" style={{justifyContent: 'center', alignItems: 'center'}}>
            <div style={{textAlign: 'center', color: 'var(--whatsapp-text-light)'}}>
              <h3>Select a chat to start messaging</h3>
              <p>Your conversations will appear here</p>
              
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chatt