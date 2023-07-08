"use client";
import Link from "next/link";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Image from "next/image";
import { useState } from "react";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";

const Nav = () => {
  // Popover code copied from Material UI docs
  // TODO: provide URL to page
  const [popoverAnchorEl, setPopoverAnchorEl] =
    useState<HTMLButtonElement | null>(null);

  const handlePopoverAnchorClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setPopoverAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };

  const isPopoverOpen = Boolean(popoverAnchorEl);
  const popoverId = isPopoverOpen ? "simple-popover" : undefined;

  return (
    <nav className="flex flex-row justify-between w-full tracking-wider p-5">
      <Link href="/">
        <Image
          src="/logos/logo-no-background.png"
          alt="logo"
          width={200}
          height={200}
          className="object-contain"
        />
      </Link>
      <Button
        aria-describedby={popoverId}
        variant="text"
        onClick={handlePopoverAnchorClick}
      >
        <AccountCircleIcon className="text-cyan-500" />
      </Button>
      <Popover
        id={popoverId}
        open={isPopoverOpen}
        anchorEl={popoverAnchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <div className="flex flex-col gap-2 p-3 text-cyan-600">
          <Link
            href="/my-orders"
            className="text-md w-full text-center hover:text-cyan-800 hover:underline"
            onClick={() => handlePopoverClose()}
          >
            {/* <Button
              variant="text"
              className="p-5 w-full text-cyan-800"
              onClick={() => handlePopoverClose()}
            >
              My Orders
            </Button> */}
            My Orders
          </Link>
          <Link
            href="/order-admin"
            className="text-md w-full text-center hover:text-cyan-800 hover:underline"
            onClick={() => handlePopoverClose()}
          >
            {/* <Button
              variant="text"
              className="w-full text-cyan-800"
              onClick={() => handlePopoverClose()}
            >
              Order Admin
            </Button> */}
            Order Admin
          </Link>
          <Link
            href="/product-admin"
            className="text-md w-full text-center hover:text-cyan-800 hover:underline"
          >
            {/* <Button
              variant="text"
              className="p-5 w-full text-cyan-800"
              onClick={() => handlePopoverClose()}
            >
              Product Admin
            </Button> */}
            Product Admin
          </Link>

          {/* <div className="w-full text-blue-900 text-md">
            <Button
              variant="text"
              className="p-5 w-full"
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          </div> */}
        </div>
      </Popover>
    </nav>
  );
};

export default Nav;
