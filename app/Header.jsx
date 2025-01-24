import Link from "next/link";
import React from "react";

const header = () => {
  return (
    <div className="header">
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
    </div>
  );
};

export default header;