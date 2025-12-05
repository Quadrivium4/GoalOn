import { IoStatsChartOutline } from "react-icons/io5";
import { RiTodoLine } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi"
import BottomNavLink from './BottomNavLink';
import { uploadProfileImg } from "../controllers/user";
import { LegacyRef, MutableRefObject, ReactNode, useRef, useState } from "react";
import Loader from "./Loader/Loader";

const ImageUpload = ({onUpload, children}: {onUpload: (id: string) => void,  children?: ReactNode}) =>{
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const upload = (files: FileList | null) =>{
    if(files && files.length > 0){
      const form = new FormData();
      form.append("image", files[0]);
      setLoading(true);
      uploadProfileImg(form).then(id =>{
        onUpload(id);
        setLoading(false);
      })

    }
  }
    if(loading) return <Loader size={40}/>
    return (
      <>
      <input type="file" onChange={e =>upload(e.target.files) } style={{display: "none"}} ref={fileInputRef}/>
      <div onClick={() =>fileInputRef.current?.click()}>
        {children}
      </div>
      </>
    )
}
export default ImageUpload