// import axios from "axios"
// import { useState } from "react"

// function SendMsg({token}){
    
//     const [input,setInput]=useState("")
//     const [phone,setPhone]=useState("")
//    const sendMessage=async ()=>{

//     await axios.post("http://127.0.0.1:8000/messages",
//         {
//             phone:phone,
//             content:input
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//     )
//     setInput("")

//    }
//     return(
//         <>
//         <label htmlFor="phone">Phone</label>
//         <input type="text" id="phone" value={phone} onChange={(e)=>setPhone(e.target.value)}  />

//         <label htmlFor="phone">Message</label>
//         <input type="text" id="phone" value={input} onChange={(e)=>setInput(e.target.value)}  />


//         <button  onClick={sendMessage}>send</button>
//         </>

//     )
// }

// export default SendMsg


import axios from "axios"
import { useState } from "react"

function SendMsg({token, recipient,getchats}){
    const [input,setInput]=useState("")
    
    const sendMessage=async ()=>{
        if (!input.trim()) return;
        
        await axios.post("http://127.0.0.1:8000/messages",
            {
                phone: recipient,
                content: input
            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        setInput("")
    }
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
            getchats()
        }
    }
    
    return(
        <div className="message-input-area">
            <input 
                type="text" 
                className="message-input"
                value={input} 
                onChange={(e)=>setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message"
                disabled={!recipient}
            />
            <button 
                className="send-btn" 
                onClick={()=>{sendMessage(),getchats()}}
                disabled={!recipient || !input.trim()}
            >
                ➤
            </button>
        </div>
    )
}

export default SendMsg