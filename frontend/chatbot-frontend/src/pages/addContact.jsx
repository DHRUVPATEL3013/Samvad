import axios from "axios"
import { useState } from "react"
import { API_BASE } from "../config"

function AddContact({token,fetchCont}){
    const [contact,setContact]=useState("")
    const [name,setName]=useState("")
    const [showForm, setShowForm] = useState(false)
    
    const addContact=()=>{
        axios.post(`${API_BASE}/add-contact`,
        {
            contact_phone:contact,
            saved_name:name
        },
         { headers: { Authorization: `Bearer ${token}` } }
        ).then(() => {
            setContact("")
            setName("")
            setShowForm(false)
            fetchCont()
            
            alert("Contact added successfully!")
        }).catch(err => {
            console.error(err)
            alert("Failed to add contact")
        })
    }
    
    return(
        <div className="add-contact-form">
            {!showForm ? (
                <button 
                    className="secondary-btn" 
                    onClick={() => setShowForm(true)}
                    style={{width: '100%'}}
                >
                    + Add New Contact
                </button>
            ) : (
                <>
                    <div className="form-group">
                        <label htmlFor="addcontact">Phone Number</label>
                        <input 
                            type="text" 
                            id="addcontact" 
                            className="form-input"
                            value={contact} 
                            onChange={(e)=>setContact(e.target.value)} 
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="savedname">Contact Name</label>
                        <input 
                            type="text" 
                            id="savedname" 
                            className="form-input"
                            value={name} 
                            onChange={(e)=>setName(e.target.value)} 
                            placeholder="Enter name to save"
                        />
                    </div>

                    <div style={{display: 'flex', gap: '10px'}}>
                        <button className="primary-btn" onClick={addContact}>Add Contact</button>
                        <button 
                            className="secondary-btn" 
                            onClick={() => setShowForm(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default AddContact