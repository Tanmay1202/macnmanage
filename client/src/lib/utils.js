import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    // console.log("tanmay");
    return twMerge(clsx(inputs));
}
