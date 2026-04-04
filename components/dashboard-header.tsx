"use client";

import { Bell, LogOut, Search, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";

export function DashboardHeader() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    signOut();
  };

  return (
    <header className="flex h-16 items-center gap-4 border-b border-slate-200 bg-white/70 px-6 backdrop-blur">
      <SidebarTrigger />

      <div className="flex flex-1 items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions, users..."
            className="pl-10 border-slate-200 bg-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs brand-bg text-white">
            3
          </Badge>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {user?.name || "Admin Account"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>

    // <header className="bg-white border-b border-gray-200 h-16 px-6">
    //   <div className="flex items-center justify-between h-full">
    //     {/* Search */}
    //     <div className="flex items-center space-x-4 flex-1 max-w-md">
    //       <div className="relative">
    //         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    //         <Input
    //           placeholder="Search users, transactions..."
    //           className="pl-10 w-96"
    //         />
    //       </div>
    //     </div>

    //     {/* Actions */}
    //     <div className="flex items-center space-x-4">
    //       {/* Notifications */}
    //       <Button variant="ghost" size="sm" className="relative">
    //         <Bell className="h-5 w-5" />
    //         <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
    //           3
    //         </Badge>
    //       </Button>

    //       {/* Profile Menu */}
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button
    //             variant="ghost"
    //             size="sm"
    //             className="flex items-center space-x-2"
    //           >
    //             <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
    //               <User className="h-4 w-4 text-white" />
    //             </div>
    //             <span className="text-sm font-medium">Admin</span>
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end" className="w-56">
    //           <DropdownMenuItem>
    //             <User className="mr-2 h-4 w-4" />
    //             Profile
    //           </DropdownMenuItem>
    //           <DropdownMenuItem>
    //             <Settings className="mr-2 h-4 w-4" />
    //             Settings
    //           </DropdownMenuItem>
    //           <DropdownMenuSeparator />
    //           <DropdownMenuItem className="text-red-600">
    //             <LogOut className="mr-2 h-4 w-4" />
    //             Logout
    //           </DropdownMenuItem>
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     </div>
    //   </div>
    // </header>
  );
}
