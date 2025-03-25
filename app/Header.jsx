import Link from "next/link";
import React from "react";
import { useState } from "react";
import LogoutButton from "./lib/buttons/Logout";
import { useAuth } from "./context/AuthContext";

const header = () => {
    
  // const [ loggedIN, setLoggedIn ] = useState(false);
  // if(user.profileID != null){
  //   setLoggedIn(true);
  // }

  return (
    <header>
      <h1>Tribes of Men</h1>
      <nav>
        <ul>
          {/* <li>
            <Link href={"/"}>Home</Link>
          </li>
          <li>
            <Link href={"/about"}>About</Link>
          </li>
          <li>
            <Link href={"/contact"}>Contact</Link>
          </li>
          <li>
            <Link href={"/"}>Login</Link>
          </li> */}
        </ul>
      </nav>
      <LogoutButton />
    </header>
  );
};

export default header;