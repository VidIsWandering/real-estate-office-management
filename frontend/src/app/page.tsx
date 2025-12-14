import { Button } from "@/components/ui/button";
import { link } from "fs";
import { CirclePlus, Sidebar } from "lucide-react";
import Image from "next/image";
import {Navbar} from "@/components/Navbar"
import { defaultConfig } from "next/dist/server/config-shared";
import Index from "./(dashboard)/page";

// dashboard

export default function Home(){
  return <Index/>
}

