import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const ProfilePage = () => {

  const { authUser, updateProfile } = useContext(AuthContext);

  const [ selectedImage, setSelectedImage ] = useState(null)
  const navigate = useNavigate()
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio ] = useState(authUser.bio);

  const handleSubmit = async (e) =>{
    e.preventDefault();
    if ( !selectedImage){
      await updateProfile({ fullName : AnimationEffect, bio});
      navigate('/')
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onload = async () =>{
      const base64Image = reader.result;
      await updateProfile({ profilePic : base64Image, fullName: name, bio});
       navigate('/'); 
    }
    
  }
  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 backdrop-blur-2xl max-w-2xl border-2 border-gray-600 text-gray-300  flex items-center justify-between rounded-lg max-sm:flex-col-reverse'>
        <form onSubmit={handleSubmit} className='flex flex-col flex-1 gap-5 p-10'>
          <h3 className='text-lg'> Profile Details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input onChange={(e)=>setSelectedImage(e.target.files[0])} type="file" id="avatar" accept='.png, .jpg, .jpeg' hidden />
            <img src={ selectedImage ? URL.createObjectURL(selectedImage) : assets.avatar_icon} alt="" className={`w-12 h-12 ${selectedImage && 'rounded-full'}`} />
            Upload profile image
          </label>
          <input onChange={(e)=>setName(e.target.value)} type="text" value={name} required placeholder='Your name' className='p-2 border border-gray-500 rounded-md focus:ouline-none focus:ring-2 focus:ring-violet-500'/>
          <textarea  onChange={(e)=>setBio(e.target.value)} value={bio} className='p-2 border border-gray-500 rounded-md focus:ouline-none focus:ring-2 focus:ring-violet-500' placeholder='Write profile bio' required rows={4}></textarea>

          <button className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer' type='submit'>save</button>
        </form>
        <img className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImage && 'rounded-full'}`} src={authUser?.profilePic || assets.logo_icon} alt="" />
      </div>
    
    </div>
  )
}

export default ProfilePage
