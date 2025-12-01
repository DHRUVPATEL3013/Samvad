import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Profile() {
    const [data, setData] = useState()
    const [fullNameValue, setFullNameValue] = useState("");
    const [genderValue, setGenderValue] = useState("");
    const [dobValue, setDobValue] = useState("");
    const [file, setFile] = useState(null);
    const navigate = useNavigate()
    const formData = new FormData()
   

 


    const token = localStorage.getItem("token")

    const getProfile = async () => {
        const res = await axios.get("http://127.0.0.1:8000/get-profile",
            { headers: { Authorization: `Bearer ${token}` } }
        )

        setData(res.data)
    }


    const updtaeProfileData=async()=>{
        
    if (fullNameValue) formData.append("fullname", fullNameValue)
     if (genderValue)formData.append("gender", genderValue)
    if (dobValue)formData.append("dob", dobValue)
    if (file) formData.append("profile_pic", file)


        
        const res = await axios.put(`http://127.0.0.1:8000/update-profile/${4}`, formData,
          
            { headers: { Authorization: `Bearer ${token}` } }
        )
        console.log(res)
        getProfile()
    

    }
  
    useEffect(() => { getProfile() }, [])
    return (

        <>{data &&
            <div onClick={() => navigate("/profile")}>
                <img  style={{width: "60px",
    height: "60px",
    borderRadius: "50%",
    marginTop: "10px",
    marginLeft: "10px"}} src={`http://127.0.0.1:8000/${data.profile_pic}`} alt="no image" />
            </div>}
            {data ? <div>

                <p>Name : {data.fullname}</p>
                <p>Gender : {data.gender}</p>
                <p>DOB : {data.dob}</p>
                
            </div> : null}

            <input 
  type="text" 
  placeholder="Full Name" 
  onChange={(e) => setFullNameValue(e.target.value)} 
/>

<select onChange={(e) => setGenderValue(e.target.value)}>
  <option value="">Select Gender</option>
  <option value="male">Male</option>
  <option value="female">Female</option>
</select>

<input 
  type="date" 
  onChange={(e) => setDobValue(e.target.value)} 
/>

<input 
  type="file" 
  onChange={(e) => setFile(e.target.files[0])} 
/>
<button onClick={updtaeProfileData}>update profile</button>

        </>

    )

}
export default Profile