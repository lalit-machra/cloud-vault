import { fileUpload, pollForCategory } from "./filesApi";
import { toast } from "@/components/ui/toast"
import { Upload } from "lucide-react";

export function UploadFile({ uploadingStatus, appendFiles, updateFileUponCategory }) {
    const handleChange = async (e) => {
        uploadingStatus(true);

        try {
            const file = await fileUpload(e.target.files[0]);
            const fileArr = [file];
            appendFiles(fileArr);
            toast.add({
                type: "info",
                description: `File was uploaded successfully.`,
            });
            pollForCategory({ fileId: file.id, updateFileUponCategory });
        } catch(err) {
            toast.add({
                type: "error",
                description: `File upload failed`,
            });
        } finally {
            uploadingStatus(false);
        }
    }

    return (
        <>
            <input type="file" id="file" onChange={handleChange} hidden></input>
            <label htmlFor="file" className="w-full">
                <div className="h-23 rounded-xl bg-cyan-500 flex justify-center items-center flex-col w-full hover:bg-cyan-600 active:bg-cyan-700">
                    <Upload className="h-7 w-18 text-white" />
                    <p className="text-white">Upload</p>
                </div>
            </label>
        </>
    );
}