import { Link } from "react-router-dom";

function Home(){
    return(
     <>
   
        <h1>this is the chat application</h1>
        <nav>

     <Link to="/signup">Sign up</Link>
        <Link to="/login">Log in</Link>
        </nav>
   
         </>
    )
}
export default Home