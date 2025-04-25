import React from 'react';
import { useAuth, useUser } from '../../context/AuthContext';
import { useNavigate, useNavigation } from 'react-router-dom';
import ImageUpload from '../../components/ImageUpload';
import { baseUrl } from '../../constants';
import "./Settings.css"
import ProfileIcon from '../../components/ProfileIcon';

function Settings() {
  const {logout, deleteAccountRequest} = useAuth();
  const user = useUser();
  const {updateUserProfileImage} = useAuth()
  return (
    <div id='settings'>
      <h1>Your Account</h1>
      <p>{user.name}</p>
      <p>{user.email}</p>
      
      <ImageUpload onUpload={(id) => updateUserProfileImage(id)}>
        <ProfileIcon profileImg={user.profileImg} name={user.name} _id={user._id}></ProfileIcon>
      </ImageUpload>
      <button onClick={async() =>{
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
  );
}

export default Settings;
