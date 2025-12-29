import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import './profile.css'
import { API_BASE } from "../config"

function Profile() {
    const [data, setData] = useState()
    const [fullNameValue, setFullNameValue] = useState("");
    const [genderValue, setGenderValue] = useState("");
    const [dobValue, setDobValue] = useState("");
    const [file, setFile] = useState(null);
    const navigate = useNavigate()
   

 


    const token = localStorage.getItem("token")

    const getProfile = async () => {
        const res = await axios.get(`${API_BASE}/get-profile`,
            { headers: { Authorization: `Bearer ${token}` } }
        )

        setData(res.data)
    }


    const updateProfileData=async()=>{
        const formData = new FormData()
        
    if (fullNameValue) formData.append("fullname", fullNameValue)
     if (genderValue)formData.append("gender", genderValue)
    if (dobValue)formData.append("dob", dobValue)
    if (file) formData.append("profile_pic", file)


        
        const res = await axios.put(`${API_BASE}/update-profile/${data.id}`, formData,
          
            { headers: { Authorization: `Bearer ${token}` } }
        )
        console.log(res)
        getProfile()
    

    }
  
    useEffect(() => { getProfile() }, [])
    return (

        <div className="profile-container">
            <div className="profile-header">
                <h1>My Profile</h1>
            </div>
            {data &&
                <div className="profile-display">
                    {/* <img className="profile-pic" src={`http://127.0.0.1:8000/${data.profile_pic}`} alt="Profile Picture" onClick={() => navigate("/profile")} /> */}
                    <img className="profile-pic" src={data.profile_pic} alt="Profile Picture" onClick={() => navigate("/profile")} />
                    <div className="profile-info">
                        <p><strong>Name:</strong> {data.fullname}</p>
                        <p><strong>Gender:</strong> {data.gender}</p>
                        <p><strong>DOB:</strong> {data.dob}</p>
                    </div>
                </div>
            }
            <div className="profile-edit">
                <h2>Update Profile</h2>
                <form>
                    <div className="form-group">
                        <label htmlFor="fullname">Full Name</label>
                        <input 
                            type="text" 
                            id="fullname"
                            placeholder="Enter your full name" 
                            onChange={(e) => setFullNameValue(e.target.value)} 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="gender">Gender</label>
                        <select id="gender" onChange={(e) => setGenderValue(e.target.value)}>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="dob">Date of Birth</label>
                        <input 
                            type="date" 
                            id="dob"
                            onChange={(e) => setDobValue(e.target.value)} 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="profilePic">Profile Picture</label>
                        <input 
                            type="file" 
                            id="profilePic"
                            onChange={(e) => setFile(e.target.files[0])} 
                        />
                    </div>
                    <button type="button" className="update-btn" onClick={updateProfileData}>Update Profile</button>
                </form>
            </div>
        </div>

    )

}
export default Profile