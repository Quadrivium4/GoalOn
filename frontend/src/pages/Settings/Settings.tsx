import React from 'react';
import { useAuth, useUser } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../../components/ImageUpload';
import { baseUrl } from '../../constants';
import "./Settings.css"
import ProfileIcon from '../../components/ProfileIcon';

function Settings() {
  const {logout} = useAuth();
  const navigate = useNavigate()
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
        navigate("/")
        }}>logout</button>
    </div>
  );
}

export default Settings;
