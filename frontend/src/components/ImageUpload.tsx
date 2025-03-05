import { IoStatsChartOutline } from "react-icons/io5";
import { RiTodoLine } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi"
import BottomNavLink from './BottomNavLink';
import { uploadProfileImg } from "../controllers/user";
import { LegacyRef, MutableRefObject, ReactNode, useRef } from "react";

const ImageUpload = ({onUpload, children}: {onUpload: (id: string) => void,  children?: ReactNode}) =>{
  const fileInputRef = useRef<HTMLInputElement>(null);
  const upload = (files: FileList | null) =>{
    if(files && files.length > 0){
      const form = new FormData();
      form.append("image", files[0]);
      uploadProfileImg(form).then(id =>{
        onUpload(id)
      })

    }
  }
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