import { fileUpload } from "./filesApi";
import { toast } from "@/components/ui/toast"

export function UploadFile({ uploadingStatus, appendFiles }) {
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
                <div className="h-36 rounded-xl bg-muted/50 flex justify-center items-center flex-col w-full hover:bg-cyan-500/20 active:bg-cyan-500/30">
                    <img src="../public/cloud-upload.svg" className="h-14 w-14"></img>
                    <p>Upload</p>
                </div>
            </label>
        </>
    );
}