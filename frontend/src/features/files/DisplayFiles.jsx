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

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { FieldGroup } from "@/components/ui/field"

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

const categoryStyles = {
  Work: "bg-purple-50 text-purple-700",
  Personal: "bg-blue-50 text-blue-700",
  Finance: "bg-green-50 text-green-700",
  Education: "bg-sky-50 text-sky-700",
  Media: "bg-orange-50 text-orange-700",
  Others: "",
};

export function DisplayFiles({ allFiles, pollingFileIds, updateFilesUponDeletion, updateFileUponSummary }) {
  const [ selected, setSelected ] = useState(null);
  const [ loadingFileId, setLoadingFileId ] = useState(null);
  const [ summaryFileId, setSummaryFileId ] = useState(null);
  const [ summaryDialogOpen, setSummaryDialogOpen ] = useState(false);
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
    setSummaryFileId(fileId);
    setSummaryLoading(true);
    setSummaryDialogOpen(true);
    try {
      const summary = await getSummary({ fileId });
      if (summary !== null) {
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
    <>
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
                  {file.category  
                    ? (<Badge variant={file.category === "Others" ? "secondary" : "default"} className={categoryStyles[file.category]}>{file.category}</Badge>)
                    : (pollingFileIds.has(file.id)
                        ? <Badge variant="outline" className="text-muted-foreground animate-pulse">Categorizing...</Badge>
                        : null
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
                      <DropdownMenuItem onClick={() => handleSummaryClick(file.id)}>
                        <Astroid></Astroid>
                        AI Summary
                      </DropdownMenuItem>
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
      <Dialog open={summaryDialogOpen} onOpenChange={setSummaryDialogOpen}>
        <DialogContent className="h-[350px] grid grid-rows-[auto_minmax(0,1fr)_auto]">
          <DialogHeader>
            <DialogTitle>File Summary</DialogTitle>
          </DialogHeader>
          <div className="min-h-0 overflow-y-auto py-5">
            {
              summaryLoading
              ? <div className="h-full flex items-center justify-center">
                  <SpinnerButton text="Generating Summary..." />
                </div>
              : (() => {
                  const file = allFiles.find((file) => file.id === summaryFileId);
                  return (file?.summary ? <p>{file.summary}</p> : <p>Couldn't fetch summary, please try again.</p>);
                })()
            }
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Close</Button>} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}