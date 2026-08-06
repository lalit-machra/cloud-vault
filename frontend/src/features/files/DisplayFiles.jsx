import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { formatDate, formatSize } from "@/common/utils/format.js";
import { listFiles } from "./filesApi.js";
import { useEffect, useState } from "react";

export function DisplayFiles() {
    const [allFiles, setAllFiles] = useState([]);

    useEffect(() => {
        const fetchFiles = async() => {
            const files = await listFiles();
            setAllFiles(files);
        }
        fetchFiles();
    }, []);

    return (
        <>
            <Table>
              <TableCaption>A list of your recent invoices.</TableCaption>
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
                  return (<TableRow key={file.id}>
                    <TableCell>{file.filename}</TableCell>
                    <TableCell>{formatDate(file.createdAt)}</TableCell>
                    <TableCell>{formatSize(file.size)}</TableCell>
                    <TableCell className="text-right"></TableCell>  
                  </TableRow>);
                })}
              </TableBody>
            </Table>
        </>
    );
}