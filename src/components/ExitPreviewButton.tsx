import { Button } from "@/components/ui/button";

export default function ExitPreviewButton() {
    return (
        <div className="fixed bottom-4 right-4 z-50">
            <Button asChild>
                <a href="/api/disable-draft">Exit Preview</a>
            </Button>
        </div>
    )
}
