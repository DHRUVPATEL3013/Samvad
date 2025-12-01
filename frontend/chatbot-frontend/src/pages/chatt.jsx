import { useEffect, useState } from "react"
import axios from "axios";
import AddContact from "./addContact";
import "./chatt.css";
import SendMsg from "./sendmessage";
import MyContacts from "./mycontacts";
import Profile from "./profile";
import {  useNavigate } from "react-router-dom";

function Chatt() {
  
  const navigate=useNavigate()

  const [ws, setWs] = useState(null)
  
  const [message, setMessage] = useState([])
   const [contacts,setContacts]=useState([])
  
  const [chat, setChat] = useState([])
  const [activeTab, setActiveTab] = useState("chats")
  const [activeChat, setActiveChat] = useState(null)

  const [profileData,setProfileData]=useState("")
  const token = localStorage.getItem("token");
  const phone = localStorage.getItem("phone")

  useEffect(() => {
    const socket = new WebSocket(`ws://127.0.0.1:8000/ws?token=${token}`);
    setWs(socket)
    socket.onopen = () => console.log("✅ WebSocket connected");
    socket.onmessage = (event) => {
      const wsData = JSON.parse(event.data)
      if (wsData.type === "message") {
        const newMessage = wsData.data
        setMessage((prev) => [...prev, newMessage])
        
      }
    }
    socket.onclose = () => { console.log("webscoket disconneted") }
    return () => socket.close()
  }, [])


  const getProfileData= async()=>{
    const res=await axios.get("http://127.0.0.1:8000/get-profile",
            {headers:{Authorization:`Bearer ${token}`}}
        )
    setProfileData(res.data)
  }


  const fetchMessage = async (peers) => {
    const res = await axios.get(`http://127.0.0.1:8000/messages/${peers}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    console.log(res.data)
    setMessage(res.data)
    setActiveChat(peers)
    getChats()
  }

 
  
      const fetchContacts=async()=>{
          const res=await axios.get('http://127.0.0.1:8000/my-contacts',
              {
                  headers:{Authorization:`Bearer ${token}`}
              }
          )
          console.log(res.data)
          setContacts(res.data)
      }
      
  const updateName = async (id, newName) => {
    const res = await axios.put(`http://127.0.0.1:8000/update-contact-name/${id}`, null,
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
    const res = await axios.get("http://127.0.0.1:8000/chats",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    console.log("hello")
    console.log(res.data)
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

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>WhatsEase</h2>
          <p>Fast and secure messaging</p>
          {/* <Profile/> */}
          <div className="profile-pic" onClick={()=>navigate("/profile")}>
            {profileData?.profile_pic?<img src={`http://127.0.0.1:8000/${profileData.profile_pic}`} alt="no image" />:profileData?.fullname?profileData.fullname.charAt(0).toUpperCase():""}

            <h3>{profileData.fullname}</h3>
            
          </div>
          
        </div>
        
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
                  onClick={() => fetchMessage(c.phone)}
                >
                  <div className="chat-avatar">

                    {c.profile_pic?<img style={{width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover"}} src={`http://127.0.0.1:8000/${c.profile_pic}`} alt="no image" />:c.saved_name ? c.saved_name.charAt(0).toUpperCase() : c.phone.charAt(0)}
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
                        ✏️
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
                {activeChat.charAt(0).toUpperCase()}
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
              
                  <div className="message-content">{m.content}</div>
                  <div className="message-time"><p> </p>{formatTime(m.timestamp)}</div>
                </div>
              ))}
            </div>
            
            <SendMsg token={token} recipient={activeChat} getchats={getChats} />
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