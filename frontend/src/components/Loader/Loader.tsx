import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../../constants"
import { getRandomUserColor } from "../../utils"
import styles from "./Loader.module.css";

export default function Loader({ size = 60}: {size?: number}){
    return (
       <div className={styles.loader}>

            <div className={styles.circle} style={{width: size, height: size, borderWidth: size/5}} >
                
            </div> 
         </div>

    )
}
