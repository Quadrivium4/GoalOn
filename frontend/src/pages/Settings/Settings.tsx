import React, { useState } from 'react';
import { MdOutlineModeEditOutline } from "react-icons/md";
import ChangeEmail from '../../components/ChangeEmail';
import ImageUpload from '../../components/ImageUpload';
import Pop from '../../components/Pop/Pop';
import ProfileIcon from '../../components/ProfileIcon/ProfileIcon';
import { useAuth, useUser } from '../../context/AuthContext';
import "./Settings.css";
import { NotificationBell } from './Notifications/Notifications';
// function OldEditing() {
//   const {editUser} = useAuth();
//   const [pop, setPop] = useState<React.ReactNode>()
//   const user = useUser();
//   const [name, setName] = useState(user.name);
//   const [bio, setBio] = useState(user.bio);
//   const [isEditing, setIsEditing] = useState<"name" | "bio" | false>("bio")

//   const handleChange = () =>{
//       console.log("handle change")
//       editUser({name, bio}).then(()=>{
//         setIsEditing(false);

//       }).catch(err=>{
//         console.log("error editing user")
//       })
//   }
//   return (
//     <>
//     {pop && <Pop children={pop} toggle={() =>setPop(undefined)}/>}
//        <div className='text'>

//           <div className='edit'>
//             {isEditing != "name"?  
//             <>
//             <p onClick={()=>{
//               setIsEditing("name");
//              }}>{name}</p>
//              <MdOutlineModeEditOutline onClick={()=>{
//               setIsEditing("name");
//              }} />
//             </>:<>  <input onChange={(e) =>setName(e.target.value)} autoFocus value={name} placeholder='name'></input>
//               <button className='outline' onClick={handleChange}>save</button>
//               </>
//             }
           
//           </div>
//           <div className='edit' >
//              <p  onClick={() => setPop(<ChangeEmail />)}>{user.email}</p>
//               <MdOutlineModeEditOutline onClick={() => setPop(<ChangeEmail />)} />
//           </div>
//            <div className='edit'>
//             {isEditing != "bio"?  
//             <>
//             <p onClick={()=>setIsEditing("bio")}>{bio}</p>
//              <MdOutlineModeEditOutline onClick={()=>setIsEditing("bio")} />
//             </>:<>  <textarea onChange={(e) =>setBio(e.target.value)} value={bio} placeholder='biography' autoFocus></textarea>
//               <button className='outline' onClick={handleChange}>save</button>
//               </>
//             }
           
//           </div>
         
//         </div>
//     </>
   
//   )
// }


function Settings() {
  const {logout, deleteAccountRequest, editUser} = useAuth();
  const [pop, setPop] = useState<React.ReactNode>()
  const user = useUser();
  const [bio, setBio] = useState(user.bio)
  const [name, setName] = useState(user.name)
  const {updateUserProfileImage} = useAuth();
  const [isEditing, setIsEditing] = useState<"name" | false>();

 
  const handleChange = () =>{
      console.log("handle change")
      editUser({name, bio}).then(()=>{
        setIsEditing(false)
      }).catch(err=>{
        console.log("error editing user")
      })
  }
  return (
    <div id='settings' className='page'>
      
      <div className="header">
        <h1>Account</h1>
           {pop && <Pop children={pop} toggle={() =>setPop(undefined)}/>}
          <NotificationBell setPop={setPop} />
      </div>
      
      <div className='info'>
        <ImageUpload onUpload={(id) => updateUserProfileImage(id)}>
          <ProfileIcon profileImg={user.profileImg} name={user.name} _id={user._id}></ProfileIcon>
        </ImageUpload>
         <div className='text'>
          <div className='edit'>
             {isEditing !== "name"?  
            <>
            <p onClick={()=>{
              setIsEditing("name");
             }}>{name}</p>
             <MdOutlineModeEditOutline onClick={()=>{
              setIsEditing("name");
             }} />
            </>:<>  <input onChange={(e) =>setName(e.target.value)} autoFocus value={name} placeholder='name'></input>
              <button className='outline' onClick={handleChange}>save</button>
              </>
            }
           
          </div>
          <div className='edit'>
                <p onClick={()=>setPop(<ChangeEmail setPop={setPop} />)}>{user.email}</p>
                <MdOutlineModeEditOutline onClick={()=>setPop(<ChangeEmail setPop={setPop} />)} />
            </div>
        </div>

      </div>
      <div className='edit-bio'>
              <textarea className='bio' value={bio} onChange={(e) =>setBio(e.target.value)} placeholder='write something about you...'></textarea>
              
              {user.bio !== bio &&<button onClick={()=> editUser({name: user.name, bio})}>save</button>}
          </div>
     <div className="buttons">
           <button className='outline' onClick={async() =>{
        let res  = await logout();
        console.log("navigating")
   
        window.location.replace("/")
        }}>logout</button>
        <button className="outline error" onClick={async() =>{
        let res  = await deleteAccountRequest();
        console.log("navigating")
   
        window.location.replace("/")
        }}>Delete Account</button>
     </div>
     
    </div>
  );
}

export default Settings;
