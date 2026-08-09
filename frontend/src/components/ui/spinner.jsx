import { cn } from "@/lib/utils"
import { Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"

function Spinner({
  className,
  ...props
}) {
  return (
    <Loader2Icon
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn("size-12 animate-spin", className)}
      {...props} />
  );
}

function SpinnerCustom() {
  return (
    <div className="flex items-center gap-4">
      <Spinner />
    </div>
  )
}

function SpinnerButton({text}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Button disabled size="xl" variant="ghost">
        <div className="flex items-center gap-4">
          <Spinner />
        </div>
        <span className="text-base p-2">{text}...</span>
      </Button>
    </div>
  )
}

function UploadSpinner() {
  return (
    <div className="h-36 w-full rounded-xl bg-muted/50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Spinner />
        <p>Uploading...</p>
      </div>
    </div>
  );
}


export { Spinner, SpinnerCustom, SpinnerButton, UploadSpinner }
