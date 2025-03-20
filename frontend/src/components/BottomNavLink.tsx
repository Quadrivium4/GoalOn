import React, { ReactNode, useEffect, useState } from 'react';
import { IconType } from 'react-icons';
import { Link, useLocation} from 'react-router-dom';

const BottomNavLink = ({href, Icon}: {href: string, Icon: IconType}) =>{
    const [isFocused, setIsFocused] = useState(false);
    const location = useLocation();
    useEffect(()=>{
        console.log(location.pathname, href)
        if(location.pathname == href && !isFocused) setIsFocused(true)
        else if(isFocused && location.pathname !== href) setIsFocused(false)
    },[location])
    return (
        <Link to={href}>
            <Icon size={22} color={isFocused? 'rgb(85, 199, 82)': "white"}></Icon>
        </Link>
    )
}
export default BottomNavLink