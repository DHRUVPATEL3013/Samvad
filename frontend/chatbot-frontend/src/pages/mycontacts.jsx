// import axios from "axios"
// import { useState } from "react"

// function MyContacts({token,getMsg}){
//     const [contacts,setContacts]=useState([])

//     const fetchContacs=async()=>{
//         const res=await axios.get('http://127.0.0.1:8000/my-contacts',
//             {
//                 headers:{Authorization:`Bearer ${token}`}
//             }
//         )
//         console.log(res.data)
//         setContacts(res.data)
//     }
//     return(

//         <>
//          <button onClick={fetchContacs}>my contacts</button>  
//         {
//             contacts.map((c,index)=>(
//                 <p key={index} onClick={()=>getMsg(c.phone)}>{c.saved_name}</p>
//             ))
//         }
         
//         </>

//     )
// }
// export default MyContacts



import axios from "axios"
import { useState, useEffect } from "react"


function MyContacts({token, getMsg,fetchCont,contacts}){
    // const [contacts,setContacts]=useState([])

    // const fetchContacts=async()=>{
    //     const res=await axios.get('http://127.0.0.1:8000/my-contacts',
    //         {
    //             headers:{Authorization:`Bearer ${token}`}
    //         }
    //     )
    //     console.log(res.data)
    //     setContacts(res.data)
    // }
    
    useEffect(() => {
        fetchCont();
    }, [token])
    
    return(
        <div className="contact-list">
            {contacts.length === 0 ? (
                <div style={{padding: '20px', textAlign: 'center', color: 'var(--whatsapp-text-light)'}}>
                    No contacts found. Add some contacts to start chatting.
                </div>
            ) : (
                contacts.map((c,index)=>(
                    <div 
                        key={index} 
                        className="contact-item"
                        onClick={()=>getMsg(c.phone)}
                    >
                        <div className="contact-avatar">
                            {c.saved_name ? c.saved_name.charAt(0).toUpperCase() : c.phone.charAt(0)}
                        </div>
                        <div className="contact-info">
                            <div className="contact-name">{c.saved_name || c.phone}</div>
                            <div className="contact-status">Contact</div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default MyContacts