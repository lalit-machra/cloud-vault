import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { formatDate, formatSize } from "@/common/utils/format.js";
import { getFile } from "./filesApi.js";

export function SearchFiles({ allFiles, keyword }) {
    const handleClick = async (fileId) => {
        const { fileUrl } = await getFile(fileId);
        window.open(fileUrl, "_blank", "noopener, noreferrer");
    }

    return (
        <>
            <Table>
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
                    if (file.filename.includes(keyword)) {
                        return (<TableRow key={file.id} onDoubleClick={() => handleClick(file.id)}>
                        <TableCell>{file.filename}</TableCell>
                        <TableCell>{formatDate(file.createdAt)}</TableCell>
                        <TableCell>{formatSize(file.size)}</TableCell>
                        <TableCell className="text-right"></TableCell>  
                        </TableRow>);
                    }
                })}
              </TableBody>
            </Table>
        </>
    );
}