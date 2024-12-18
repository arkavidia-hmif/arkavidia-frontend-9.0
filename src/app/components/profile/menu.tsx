import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button"

export type contentType = "Profile Information" | "Social Media";

interface Props{
    Selected : contentType,
    setSelected : Dispatch<SetStateAction<contentType>>
    title: contentType,    
}

export const Menu = (props : Props) => {
    const isSelected = props.Selected == props.title;
    
    // Set the current menu into active state
    function onClick(){
        props.setSelected(props.title);
    }
    
    return(
        <Button variant={"ghost"} className="text-white h-full px-0 w-full flex-col flex py-0 hover:bg-white/40 hover:text-white" onClick={onClick}>
            <h1 className="font-bold font-teachers text-2xl">{props.title}</h1>
            {
                isSelected ?
                <span className="h-1.5 w-full bg-gradient-to-r from-[#FF95B8] via-[#A555CC] to-[#48E6FF] rounded-full"></span> :
                <span className="h-1.5 w-full"></span>
            }
        </Button>
    )
}