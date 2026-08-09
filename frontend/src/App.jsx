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
import { UploadSpinner } from "./components/ui/spinner.jsx"
"use client"

import { useAuth } from "./common/context/AuthContext.jsx";
import { DisplayFiles } from "./features/files/DisplayFiles.jsx"
import { UploadFile } from "./features/files/UploadFile.jsx"
import { SearchFiles } from "./features/files/SearchFiles.jsx"
import { useState } from "react"

export default function App() {
  const { user, logout } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [allFiles, setAllFiles] = useState([]);
  const [search, setSearch] = useState("");

  const uploadingStatus = (value) => {
    setUploading(value);
  }

  const appendFiles = (files) => {
    setAllFiles((prev) => [...prev, ...files]);
  }

  const updateFilesList = (files) => {
    setAllFiles(files);
  }

  const updateFilesUponDeletion = (deleteFileId) => {
    setAllFiles((prev) => prev.filter((file) => file.id != deleteFileId));
  }

  const onChangeSearch = (e) => {
    setSearch(e.target.value);
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <div className=" w-full h-full flex justify-between items-center m-5">
            <h1 className="text-2xl">Welcome <span className="text-cyan-500">{user.username}</span></h1>
            <DropdownMenu>
              <DropdownMenuTrigger nativeButton={false} render={<img src="../public/account.svg" className="h-10 w-10 hover:bg-cyan-500/10"></img>} />
              <DropdownMenuContent>
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid gap-4 md:grid-cols-[1fr_3fr]">
            <div className="grid gap-4 rounded-xl bg-muted/50 grid-cols-2">
              {uploading ? <UploadSpinner></UploadSpinner> : <UploadFile uploadingStatus={uploadingStatus} appendFiles={appendFiles}></UploadFile>}
              <div></div>
            </div>
            <div className="h-36 rounded-xl bg-muted/50 flex flex-row justify-center items-center">
              <Field className="h-full w-3/4 p-10">
                <InputGroup className="flex flex-row justify-center items-center h-full">
                  <InputGroupInput id="inline-start-input" placeholder="Search..." className="text-2xl"  value={search} onChange={onChangeSearch}  />
                  <InputGroupAddon align="inline-start">
                    <SearchIcon className="text-muted-foreground" />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            </div>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min px-3">
            {search === "" ?
              <DisplayFiles allFiles={allFiles} updateFilesList={updateFilesList} updateFilesUponDeletion={updateFilesUponDeletion}></DisplayFiles> :
              <SearchFiles allFiles={allFiles} keyword={search}></SearchFiles>
            }
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
