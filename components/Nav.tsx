"use client";
import Link from "next/link";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
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
    <nav className="flex flex-row w-full tracking-wider">
      <Link href="/">
        <Image
          src="/logos/logo-no-background.png"
          alt="logo"
          width={200}
          height={200}
          className="object-contain"
        />
      </Link>
      <div className="flex flex-row justify-end flex-grow">
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
            horizontal: "left",
          }}
        >
          <div className="flex flex-col gap-2 p-3 text-cyan-600">
            <Link
              href="/my-orders"
              className="text-md w-full text-center hover:text-cyan-800 hover:underline"
              onClick={() => handlePopoverClose()}
            >
              My Orders
            </Link>
            <Link
              href="/order-admin"
              className="text-md w-full text-center hover:text-cyan-800 hover:underline"
              onClick={() => handlePopoverClose()}
            >
              Order Admin
            </Link>
            <Link
              href="/product-admin"
              className="text-md w-full text-center hover:text-cyan-800 hover:underline"
              onClick={() => handlePopoverClose()}
            >
              Product Admin
            </Link>
          </div>
        </Popover>
        <Button variant="text">
          <Link href="/shopping-cart">
            <ShoppingCartIcon className="text-cyan-500" />
          </Link>
        </Button>
      </div>
    </nav>
  );
};

export default Nav;
