import { NAVBAR_HEIGHT } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";

export const Navbar = () => {
    return (
        <div
            className="fixed top-0 left-0 w-full z-50 shadow-xl"
            style={{
                height: `${NAVBAR_HEIGHT}px`
            }}
        >   
        </div>
    )
}