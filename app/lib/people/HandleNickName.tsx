"use client";
import React, { useState, useEffect, useRef } from "react";
import { People, PersonName } from "../types/people";

interface HandleNickNameProps {
    person: PersonName;
}

const HandleNickName: React.FC<HandleNickNameProps> = ({ person }) => {
    const [ displayName, setDisplayName ] = useState<string | null>(null);
    useEffect(() => {
        if(person.nickName && person.nickName.length > 0){
            setDisplayName(person.nickName[0]);
        }
        else {
            setDisplayName(`${person.firstName} ${person.lastName}`)
        }
    }, []);
    // console.log(person.firstName);
    return(
        <>{displayName}</>
    )
};

export default HandleNickName;