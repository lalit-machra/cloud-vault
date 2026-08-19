import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Button } from "@base-ui/react";
import { cn } from "@/lib/utils.js";
import { toast } from "@/components/ui/toast.jsx";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Badge } from "@/components/ui/badge"

import { MoreVerticalIcon } from "lucide-react";
import {
  Eye,
  Download,
  Trash2Icon,
  Astroid
} from "lucide-react"

import { formatDate, formatSize } from "@/common/utils/format.js";
import { getFile, deleteFile, getSummary } from "./filesApi.js";
import { useEffect, useState, useRef } from "react";
import { getFileIcon } from "./filesUtils.js";
import { SpinnerButton } from "@/components/ui/spinner.jsx";

export function DisplayFiles({ allFiles, updateFilesUponDeletion, updateFileUponSummary }) {
  const [ selected, setSelected ] = useState(null);
  const [ loadingFileId, setLoadingFileId ] = useState(null);
  const [ summaryLoading, setSummaryLoading ] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setSelected(null);  
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  const handleClick = async (fileId) => {
    setSelected(fileId);
  }

  const handleDoubleClick = async (fileId) => {
    const { fileUrl } = await getFile(fileId, false);
    window.open(fileUrl, "_blank", "noopener, noreferrer");
  }

  const handleSummaryClick = async (fileId) => {
    setSummaryLoading(true);
    try {
      const summary = await getSummary({ fileId });
      if (summary) {
        updateFileUponSummary(fileId, summary);
      }
    } finally {
      setSummaryLoading(false);
    }
  }

  const handlePreviewClick = async (fileId) => {
    const { fileUrl } = await getFile(fileId, false);
    window.open(fileUrl, "_blank", "noopener, noreferrer");
  }

  const handleDownloadClick = async (fileId) => {
    const { fileUrl } = await getFile(fileId, true);
    window.location.href = fileUrl;
  }

  const handleDeleteClick = async (fileId) => {
    setLoadingFileId(fileId);
    try {
      await deleteFile(fileId);
      updateFilesUponDeletion(fileId);
      toast.add({
        type: "info",
        description: `File was deleted successfully.`,
      });
    } catch(err) {
      toast.add({
        type: "error",
        description: `File deletion failed`,
      });
    } finally {
      setLoadingFileId(null);
    }
  }

  return (
    <Table ref={containerRef}>
      <TableHeader>
        <TableRow className="hover:bg-cyan-500/0">
          <TableHead className="w-1/2">File</TableHead>
          <TableHead>Date Created</TableHead>
          <TableHead>Size</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allFiles.map((file) => {
          return (<TableRow key={file.id} className={cn("group", file.id === selected ? "bg-cyan-500/40" : "hover:bg-cyan-500/15", file.id === loadingFileId && "pointer-events-none opacity-30 bg-cyan-500/0 hover:bg-cyan-500/0")} onClick={() => handleClick(file.id)} onDoubleClick={() => handleDoubleClick(file.id)}>
            <TableCell>
              <div className="flex flex-row justify-start items-center h-full gap-2">
                <img src={getFileIcon(file.mime)} className="h-6 w-6 shrink-0" alt="" />
                <span>{file.filename}</span>
                {file.category && 
                  (
                    file.category === "Work" ? <Badge className="bg-purple-50 text-purple-700">{file.category}</Badge> :
                    file.category === "Personal" ? <Badge className="bg-blue-50 text-blue-700">{file.category}</Badge> :
                    file.category === "Finance" ? <Badge className="bg-green-50 text-green-700">{file.category}</Badge> :
                    file.category === "Education" ? <Badge className="bg-sky-50 text-sky-700">{file.category}</Badge> :
                    file.category === "Media" ? <Badge className="bg-orange-50 text-orange-700">{file.category}</Badge> :  <Badge variant="secondary">Others</Badge>
                  )
                }
              </div>
            </TableCell>
            <TableCell>{formatDate(file.createdAt)}</TableCell>
            <TableCell>{formatSize(file.size)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="More Options" onClick={(e) => e.stopPropagation()} className={cn("opacity-0", file.id === selected ? "opacity-100" : "group-hover:opacity-100")}><MoreVerticalIcon /></Button>} />
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuGroup>
                    <Dialog>
                      <DialogTrigger nativeButton={false} render={
                        <DropdownMenuItem onClick={() => handleSummaryClick(file.id)}>
                          <Astroid></Astroid>
                          AI Summary
                        </DropdownMenuItem>
                      } />
                      <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                          <DialogTitle>File Summary</DialogTitle>
                        </DialogHeader>
                        <FieldGroup>
                          {
                            summaryLoading ? <SpinnerButton text="Loading Summary..."></SpinnerButton> :
                            file.summary ? <p>{file.summary}</p> : <p>Couldn't fetch summary, please try again.</p>
                          }
                        </FieldGroup>
                        <DialogFooter>
                          <DialogClose render={<Button variant="outline">Close</Button>} />
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <DropdownMenuItem onClick={() => handlePreviewClick(file.id)}>
                      <Eye></Eye>
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownloadClick(file.id)}>
                      <Download></Download>
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={() => handleDeleteClick(file.id)}>
                      <Trash2Icon />
                        Delete
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>  
            </TableCell>  
          </TableRow>);
        })}
      </TableBody>
    </Table>
  );
}