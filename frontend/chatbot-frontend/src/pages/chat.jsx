

// import { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import "./chat.css";

// function Chat() {
//   const [ws, setWs] = useState(null);
//   const [chats, setChats] = useState({}); // { email: [messages] }
//   const [activeChat, setActiveChat] = useState(null);
//   const [text, setText] = useState("");
//   const [contacts, setContacts] = useState([]);
//   const [ShowModel,setShowModal]=useState(true);
//   const [ContactInput,setContactInput]=useState("");
//   const [ContactName,setContactName]=useState("");
//   const token = localStorage.getItem("token");
//   const email = localStorage.getItem("email");
//   const messagesEndRef = useRef(null);

//   // scroll to bottom when messages change
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };
//   useEffect(scrollToBottom, [chats, activeChat]);

//   // connect WebSocket
//   useEffect(() => {
//     if (!token) return;
//     const socket = new WebSocket(`ws://127.0.0.1:8000/ws?token=${token}`);

//     socket.onopen = () => console.log("✅ WebSocket connected");
//     socket.onclose = () => console.log("❌ WebSocket disconnected");

//     socket.onmessage = (e) => {
//       try {
//         const msg = JSON.parse(e.data);
//         if (msg.type === "message" && msg.data) {
//           const data = msg.data;
//           const peer =
//             data.sender === email ? data.recipient : data.sender;

//           // add new message in the right chat
//           setChats((prev) => {
//             const updated = prev[peer] ? [...prev[peer]] : [];
//             if (!updated.some((m) => m.id === data.id)) updated.push(data);
//             return { ...prev, [peer]: updated };
//           });
//         }
//       } catch (err) {
//         console.error("Error parsing WS message:", err);
//       }
//     };

//     setWs(socket);
//     return () => socket.close();
//   }, [token]);

//   // auto-update contacts when chats change
//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         const res = await axios.get("http://127.0.0.1:8000/chats", {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         const BOT_EMAIL = "bot@whatsease.com";

//         let list = res.data;

//         if (!list.includes(BOT_EMAIL)) {
//           list.unshift(BOT_EMAIL);
//         }

//         setContacts(list);

//       }

//       catch (err) {
//         console.log("failed to fetch chats")

//       }
//     }
//     if (token) fetchChats()
//     const allContacts = Object.keys(chats);
//     setContacts(allContacts);
//   }, [chats]);

//   // send a message
//   const sendMessage = async () => {
//     if (!activeChat || !text.trim()) return;
//     try {
//       const payload = { recipient: activeChat, content: text };
//       setText("");
//       await axios.post("http://127.0.0.1:8000/messages", payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//     } catch (err) {
//       console.error("Send failed:", err);
//       alert("Failed to send message");
//     }
//   };

//   // load messages when chat clicked
//   const loadChat = async (peer) => {
//     if (!peer) return;
//     try {
//       const res = await axios.get(
//         `http://127.0.0.1:8000/messages/${peer}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setChats((prev) => ({ ...prev, [peer]: res.data }));
//       setActiveChat(peer);
//     } catch (err) {
//       console.error("Load chat failed:", err);
//       alert("Failed to load chat");
//     }
//   };

//   const addContact = async () => {
//   if (!ContactInput || !ContactName) return alert("Fill all fields!");

//   try {
//     await axios.post(
//       "http://127.0.0.1:8000/contacts/add",
//       { 
//         email: ContactInput.includes("@") ? ContactInput : null,
//         phone: ContactInput.includes("@") ? null : ContactInput,
//         name: ContactName
//       },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     // setShowModal(false);
//     setContactInput("");
//     setContactName("");

//     // fetch new contacts
//     loadContacts();

//   } catch (err) {
//     console.error(err);
//     alert("Failed to add contact");
//   }
// };


//   return (
//     <div className="chat-container">
//       {/* Sidebar */}
//       <div className="chat-sidebar">
//         <div className="user-info">
//           <h3>WhatsEase</h3>
//           <div className="user-email">{email}</div>
//         </div>

//         <div className="contacts-list">
//           {contacts.length === 0 ? (
//             <div
//               style={{
//                 textAlign: "center",
//                 color: "#a0aec0",
//                 marginTop: "40px",
//               }}
//             >
//               No chats yet <br />
//               {/* <button
//                 className="load-button"
//                 style={{ marginTop: "10px" }}
//                 onClick={() => {
//                   const newEmail = prompt("Enter recipient email to start chat:");
//                   if (newEmail) {
//                     setChats((prev) => ({ ...prev, [newEmail]: [] }));
//                     setActiveChat(newEmail);
//                   }
//                 }}
//               >
//                 ➕ Start New Chat
//               </button> */}
//               (
//   <div className="modal-overlay">
//     <div className="modal-box">
//       <h3>Add New Contact</h3>

//       <input
//         placeholder="Email or Phone"
//         className="modal-input"
//         value={ContactInput}
//         onChange={(e) => setContactInput(e.target.value)}
//       />

//       <input
//         placeholder="Display Name"
//         className="modal-input"
//         value={ContactName}
//         onChange={(e) => setContactName(e.target.value)}
//       />

//       <div className="modal-actions">
//         <button className="modal-btn cancel" onClick={() => setShowModal(false)}>Cancel</button>
//         <button className="modal-btn add" onClick={addContact}>Add</button>
//       </div>
//     </div>
//   </div>
// )

//             </div>
//           ) : 
//           (
//             <>
//               {/* <button
//                 className="load-button"
//                 style={{
//                   margin: "10px auto",
//                   width: "90%",
//                   display: "block",
//                   borderRadius: "10px",
//                 }}
//                 onClick={() => {
//                   const newEmail = prompt("Enter recipient email to start chat:");
//                   if (newEmail) {
//                     setChats((prev) => ({ ...prev, [newEmail]: [] }));
//                     setActiveChat(newEmail);
//                   }
//                 }}
//               >
//                 ➕ Start New Chat
//               </button> */}

//               {contacts.map((c) => (
//                 <div
//                   key={c}
//                   className={`contact-item ${activeChat === c ? "active" : ""}`}
//                   onClick={() => loadChat(c)}
//                 >
//                   <span className="online-status"></span>
//                   {c}
//                 </div>
//               ))}
//             </>
//           )}
//         </div>
//       </div>

//       {/* Main Chat */}
//       <div className="chat-main">
//         <div className="chat-header">
//           <div className="recipient-info">
//             <h3>{activeChat || "Select a chat"}</h3>
//             <span>
//               {activeChat ? "Online" : "Start chatting with someone"}
//             </span>
//           </div>
//         </div>

//         <div className="messages-container">
//           {!activeChat ? (
//             <div
//               style={{
//                 textAlign: "center",
//                 color: "#666",
//                 marginTop: "50px",
//               }}
//             >
//               <h3>Select a contact to start chatting</h3>
//             </div>
//           ) : (chats[activeChat] || []).length === 0 ? (
//             <div
//               style={{
//                 textAlign: "center",
//                 color: "#666",
//                 marginTop: "50px",
//               }}
//             >
//               <h3>No messages yet</h3>
//               <p>Send the first message!</p>
//             </div>
//           ) : (
//             (chats[activeChat] || []).map((m) => (
//               <div
//                 key={m.id}
//                 className={`message ${m.sender === email ? "sent" : "received"
//                   } ${m.is_bot_response ? "bot" : ""}`}
//               >
//                 <div className="message-bubble">
//                   {m.sender !== email && (
//                     <div className="message-sender">
//                       {m.sender === "bot@whatsease.com"
//                         ? "Gemini Bot"
//                         : m.sender}
//                     </div>
//                   )}
//                   <div className="message-content">{m.content}</div>
//                   <div className="message-time">
//                     {new Date(m.timestamp).toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input */}
//         {activeChat && (
//           <div className="input-container">
//             <input
//               className="message-input"
//               placeholder="Type a message..."
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//             />
//             <button className="send-button" onClick={sendMessage}>
//               Send
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Chat;


import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./chat.css";

function Chat() {
  const [ws, setWs] = useState(null);
  const [chats, setChats] = useState({}); 
  const [activeChat, setActiveChat] = useState(null);
  const [text, setText] = useState("");

  const [contacts, setContacts] = useState([]);

  // MODAL STATES
  const [showModal, setShowModal] = useState(false);
  const [contactInput, setContactInput] = useState("");
  const [contactName, setContactName] = useState("");

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  const messagesEndRef = useRef(null);

  // ✅ Scroll to bottom when chat changes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [chats, activeChat]);


  // ✅ WebSocket Connection
  useEffect(() => {
    if (!token) return;

    const socket = new WebSocket(`ws://127.0.0.1:8000/ws?token=${token}`);

    socket.onopen = () => console.log("✅ WebSocket connected");
    socket.onclose = () => console.log("❌ WebSocket disconnected");

    socket.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === "message" && msg.data) {
          const data = msg.data;
          const peer = data.sender === email ? data.recipient : data.sender;

          setChats((prev) => {
            const updated = prev[peer] ? [...prev[peer]] : [];
            if (!updated.some((m) => m.id === data.id)) updated.push(data);
            return { ...prev, [peer]: updated };
          });
        }
      } catch (err) {
        console.error("WS Parse Error:", err);
      }
    };

    setWs(socket);
    return () => socket.close();
  }, [token]);


  // ✅ Load contacts (from backend)
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/chats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const BOT_EMAIL = "bot@whatsease.com";

        let list = res.data;

        // Add bot on top if not present
        if (!list.includes(BOT_EMAIL)) list.unshift(BOT_EMAIL);

        setContacts(list);
      } catch (err) {
        console.log("Failed to load contacts");
      }
    };

    if (token) fetchContacts();
  }, [token, chats]);


  // ✅ Load chat messages of a contact
  const loadChat = async (peer) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/messages/${peer}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setChats((prev) => ({ ...prev, [peer]: res.data }));
      setActiveChat(peer);
    } catch (err) {
      console.log("Failed to load chat");
    }
  };


  // ✅ Send Message
  const sendMessage = async () => {
    if (!activeChat || !text.trim()) return;
    try {
      await axios.post(
        "http://127.0.0.1:8000/messages",
        { recipient: activeChat, content: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText("");
    } catch (err) {
      alert("Failed to send message");
    }
  };


  // ✅ Add Contact (Modal)
  const addContact = async () => {
    if (!contactInput || !contactName) return alert("Please fill all fields");

    try {
      await axios.post(
        "http://127.0.0.1:8000/add-contact",
        {
          contact_email: contactInput.includes("@") ? contactInput : null,
          contact_phone: contactInput ? contactInput : null,
          saved_name: contactName,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowModal(false);
      setContactInput("");
      setContactName("");
    } catch (err) {
      console.log(err)
      alert("Error adding contact");
    }
  };


  return (
    <>
      <div className="chat-container">

        {/* ✅ SIDEBAR */}
        <div className="chat-sidebar">
          <div className="user-info">
            <h3>WhatsEase</h3>
            <div className="user-email">{email}</div>
          </div>

          <button
            className="load-button"
            style={{ width: "90%", margin: "10px auto" }}
            onClick={() => setShowModal(true)}
          >
            ➕ Add Contact
          </button>

          <div className="contacts-list">
            {contacts.map((c) => (
              <div
                key={c}
                className={`contact-item ${activeChat === c ? "active" : ""}`}
                onClick={() => loadChat(c)}
              >
                <span className="online-status"></span>
                {c}
              </div>
            ))}
          </div>
        </div>


        {/* ✅ MAIN CHAT WINDOW */}
        <div className="chat-main">
          <div className="chat-header">
            <div className="recipient-info">
              <h3>{activeChat || "Select Chat"}</h3>
              <span>{activeChat ? "Online" : "Start chatting"}</span>
            </div>
          </div>

          {/* ✅ MESSAGES */}
          <div className="messages-container">
            {!activeChat ? (
              <div className="center-text">Select a contact to start</div>
            ) : (chats[activeChat] || []).length === 0 ? (
              <div className="center-text">No messages yet</div>
            ) : (
              (chats[activeChat] || []).map((m) => (
                <div
                  key={m.id}
                  className={`message ${m.sender === email ? "sent" : "received"
                    } ${m.is_bot_response ? "bot" : ""}`}
                >
                  <div className="message-bubble">
                    <div className="message-content">{m.content}</div>
                    <div className="message-time">
                      {new Date(m.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ✅ INPUT */}
          {activeChat && (
            <div className="input-container">
              <input
                className="message-input"
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button className="send-button" onClick={sendMessage}>
                Send
              </button>
            </div>
          )}
        </div>
      </div>


      {/* ✅ GLOBAL MODAL (Correct position) */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Add New Contact</h3>

            <input
              placeholder="Email or Phone"
              className="modal-input"
              value={contactInput}
              onChange={(e) => setContactInput(e.target.value)}
            />

            <input
              placeholder="Display Name"
              className="modal-input"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />

            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="modal-btn add" onClick={addContact}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Chat;
