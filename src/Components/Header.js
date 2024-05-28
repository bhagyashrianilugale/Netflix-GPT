import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useSelector,useDispatch } from "react-redux";
import {addUser} from "../utils/userSlice";
import { removeUser } from "../utils/userSlice";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LOGO_URL } from "../utils/Constants";

const Header =  ()=>{
    
    const navigate = useNavigate();
    const dispatch = useDispatch(); 
    const user = useSelector(store => store.user);
    const handleBtnClick = ()=>{
        signOut(auth).then(() => {
         }).catch((error) => {
            console.log(error);
        });
        
    };
    useEffect(()=>{
        const unSubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
               // User is signed in
               const displayName = user.displayName;
               const email = user.email;
               const uid = user.uid;
               const photoURL = user.photoURL;
               dispatch(addUser(
                   {
                    uid:uid, 
                    email: email, 
                    displayName: displayName, 
                    photoURL: photoURL
                   }));
               navigate("/browse");

              } else {
              // User is signed out
              dispatch(removeUser());
              navigate("/");
            }
      });

      // Unsubscribe logic when component unmount
      return (()=> unSubscribe());

    },[]);

    return(
        <div className="z-10 p-2 w-screen absolute bg-gradient-to-b from-black flex justify-between">
              <img  className="w-80 px-10 mx-20 " src={LOGO_URL} alt="logo_img"/>
               {user && (
                    <div className="flex p-4">
                    <div className="h-10 w-10 mx-2"><img src={user.photoURL} atl="usericon"/></div>
                    <div><button className="font-bold  text-white" onClick={handleBtnClick}>Sign Out</button></div>
                 </div>
               )}
        </div>
    )
};

export default Header;