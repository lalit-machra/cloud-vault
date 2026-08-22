import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { SearchIcon, ArrowUpDown  } from "lucide-react"
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
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"

import { UploadSpinner } from "@/components/ui/spinner.jsx"

import { useAuth } from "@/common/context/AuthContext.jsx"
import { DisplayFiles } from "../files/DisplayFiles.jsx"
import { UploadFile } from "../files/UploadFile.jsx"
import { listFiles } from "../files/filesApi.js"
import { searchFiles, sortFiles } from "../files/filesUtils.js"

import { useState, useEffect } from "react"

export default function App() {
  const { user, logout } = useAuth();
  const [ uploading, setUploading ] = useState(false);
  const [ allFiles, setAllFiles ] = useState([]);
  const [ search, setSearch ] = useState("");
  const [ sort, setSort ] = useState("");
  const [ pollingFileIds, setPollingFileIds] = useState(new Set());

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

  const updateFileUponCategory = (fileId, category) => {
    setAllFiles((prev) => prev.map((file) => file.id === fileId ? {...file, category} : file));
  }

  const updateFileUponSummary = (fileId, summary) => {
    setAllFiles((prev) => prev.map((file) => file.id === fileId ? { ...file, summary } : file));
  }

  const onChangeSearch = (e) => {
    setSearch(e.target.value);
  } 

  const updatePollingFileId = (fileId, isPolling) => {
    setPollingFileIds((prev) => {
      const next = new Set(prev);
      if (isPolling) next.add(fileId);
      else next.delete(fileId); 
      return next;
    });
  }

  useEffect(() => {
    const fetchFiles = async() => {
      const files = await listFiles();
      updateFilesList(files);
    }
    fetchFiles();
  }, []);

  const searchedFiles = searchFiles({ allFiles, keyword: search });
  const filteredFiles = sortFiles({ allFiles: searchedFiles, option: sort });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <div className=" w-full h-full flex justify-between items-center m-5">
            <h1 className="text-3xl">Welcome <span className="text-cyan-500">{user.username}</span></h1>
            <DropdownMenu>
              <DropdownMenuTrigger nativeButton={false} render={<img src="/account.svg" className="h-10 w-10 hover:bg-cyan-500/15"></img>} />
              <DropdownMenuContent>
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="grid gap-4 md:grid-cols-[2fr_5fr] py-2">
            <div className="grid gap-16 rounded-xl grid-cols-2 px-5">
              {uploading ? <UploadSpinner></UploadSpinner> : <UploadFile uploadingStatus={uploadingStatus} appendFiles={appendFiles} updateFileUponCategory={updateFileUponCategory} updatePollingFileId={updatePollingFileId}></UploadFile>}
              <DropdownMenu>
                <DropdownMenuTrigger nativeButton={false} render={
                  <div className="h-23 rounded-xl border border-cyan-500 flex justify-center items-center flex-col w-full hover:bg-cyan-100/20 active:bg-cyan-500/30">
                    <ArrowUpDown className="h-7 w-18 text-cyan-500" />
                    <p className="text-cyan-500">Sort</p>
                </div>} />
                <DropdownMenuContent className="w-32">
                  <DropdownMenuGroup>
                    <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                      <DropdownMenuRadioItem value="" className="opacity-70">Clear</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="name-asc">Name (A–Z)</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="name-desc">Name (Z–A)</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="date-desc">Newest first</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="date-asc">Oldest first</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="h-23 rounded-xl flex flex-row justify-center items-center">
              <Field className="h-full w-3/4 p-5">
                <InputGroup className="flex flex-row justify-center items-center h-full border-1 border-cyan-500 ">
                  <InputGroupInput id="inline-start-input" placeholder="Search..." className="h-20 text-2xl" autoComplete="off" value={search} onChange={onChangeSearch}  />
                  <InputGroupAddon align="inline-start">
                    <SearchIcon className="text-cyan-500" />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            </div>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min px-3 py-2">
            <DisplayFiles allFiles={filteredFiles} pollingFileIds={pollingFileIds} updateFilesList={updateFilesList} updateFilesUponDeletion={updateFilesUponDeletion} updateFileUponSummary={updateFileUponSummary}></DisplayFiles>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
