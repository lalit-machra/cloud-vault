import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { SearchIcon } from "lucide-react"
import {
  Field,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useAuth } from "./common/context/AuthContext.jsx";
import { DisplayFiles } from "./features/files/DisplayFiles.jsx"

export default function App() {
  const { user, logout } = useAuth();
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <div className=" w-full h-full flex justify-between items-center m-5">
            <h1 className="text-2xl">Welcome <span className="text-cyan-500">{user.username}</span></h1>
            <DropdownMenu>
              <DropdownMenuTrigger render={<img src="../public/account.svg" className="h-10 w-10 hover:bg-cyan-500/10"></img>} />
              <DropdownMenuContent>
                <DropdownMenuItem><button onClick={(e) => {e.stopPropagation(); logout();}}>Logout</button></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid gap-4 md:grid-cols-[1fr_3fr]">
            <div className="grid gap-4 rounded-xl bg-muted/50 grid-cols-2">
              <div className="h-36 rounded-xl bg-muted/50 flex justify-center items-center flex-col w-full">
                  <img src="../public/cloud-upload.svg" className="h-14 w-14"></img>
                  <p>Upload</p>
              </div>
            </div>
            <div className="h-36 rounded-xl bg-muted/50 flex flex-row justify-center items-center">
              <Field className="h-full w-3/4 p-10">
                <InputGroup className="flex flex-row justify-center items-center h-full">
                  <InputGroupInput id="inline-start-input" placeholder="Search..." className="text-2xl"  />
                  <InputGroupAddon align="inline-start">
                    <SearchIcon className="text-muted-foreground" />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            </div>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min px-3">
            <DisplayFiles></DisplayFiles>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
