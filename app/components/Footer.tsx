import React from "react";
import Title from "./Title";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex flex-col gap-4 px-6 ">
      <div>
        <Title size="text-2xl">Gymforage</Title>
        <p className="text-neutral-400 mt-4">
          The ultimate fitness tracking app designed for tracking and create
          your own exercises.
        </p>
      </div>
      <div>
        <Title size="text-md">Product</Title>
        <div className="text-neutral-400 mt-4">
          <Link href={"#features"}>Features</Link>
          <p id="#progress">How it works</p>
          <p id="#">Features</p>
        </div>
      </div>
      <div>
        <Title size="md">Categories</Title>
        <div className="text-neutral-400 mt-4">
          <p>Chest Training</p>
          <p>Back Training</p>
          <p>Leg Training</p>
          <p>Shoulders</p>
          <p>Arms</p>
        </div>
      </div>
      <div className="border-t-2 border-neutral-800 py-10 text-center text-neutral-400">
        <p>© 2026 GymForge. Built for champions. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
