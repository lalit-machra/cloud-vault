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

import { MoreVerticalIcon } from "lucide-react";
import {
  Eye,
  Download,
  Trash2Icon
} from "lucide-react"

import { formatDate, formatSize } from "@/common/utils/format.js";
import { getFile, listFiles, deleteFile } from "./filesApi.js";
import { useEffect, useState, useRef } from "react";

export function DisplayFiles({ allFiles, updateFilesList, updateFilesUponDeletion }) {
  const [ selected, setSelected ] = useState(null);
  const [ loadingFileId, setLoadingFileId ] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
      const fetchFiles = async() => {
        const files = await listFiles();
        updateFilesList(files);
      }
      fetchFiles();
  }, []);

  useEffect(() => {
    const hanldeClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setSelected(null);  
      }
    }

    document.addEventListener("mousedown", hanldeClickOutside);

    return () => {
        document.removeEventListener("mousedown", hanldeClickOutside);
    }
  }, []);

  const handleClick = async (fileId) => {
    setSelected(fileId);
  }

  const handleDoubleClick = async (fileId) => {
    const { fileUrl } = await getFile(fileId, false);
    window.open(fileUrl, "_blank", "noopener, noreferrer");
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
                return (<TableRow key={file.id} className={cn("group", file.id === selected ? "bg-cyan-500/20" : "hover:bg-cyan-500/5", file.id === loadingFileId && "pointer-events-none opacity-30 bg-cyan-500/0 hover:bg-cyan-500/0")} onClick={() => handleClick(file.id)} onDoubleClick={() => handleDoubleClick(file.id)}>
                  <TableCell>{file.filename}</TableCell>
                  <TableCell>{formatDate(file.createdAt)}</TableCell>
                  <TableCell>{formatSize(file.size)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="More Options" onClick={(e) => e.stopPropagation()} className={cn("opacity-0", file.id === selected ? "opacity-100" : "group-hover:opacity-100")}><MoreVerticalIcon /></Button>} />
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuGroup>
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
      </>
  );
}