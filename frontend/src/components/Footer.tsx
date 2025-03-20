import { IoStatsChartOutline } from "react-icons/io5";
import { RiTodoLine } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi"
import BottomNavLink from './BottomNavLink';

const Footer = () =>{
    return (
      <footer>
        <BottomNavLink href='/' Icon={RiTodoLine}></BottomNavLink>
        <BottomNavLink href='/stats' Icon={IoStatsChartOutline}></BottomNavLink>
        <BottomNavLink href='/settings' Icon={IoSettingsOutline}></BottomNavLink>
        <BottomNavLink href='/friends' Icon={HiUserGroup}></BottomNavLink>
      </footer>
    )
}
export default Footer