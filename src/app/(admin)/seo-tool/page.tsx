import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SeoGeneratorForm from "@/components/forms/seo-generator-form";

export default function SeoToolPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Automated SEO Content Generator</CardTitle>
                <CardDescription>
                    Generate SEO-optimized title tags, meta descriptions, and structured data for your web pages.
                    This tool uses AI to analyze your content and keywords for better search engine ranking.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SeoGeneratorForm />
            </CardContent>
        </Card>
    );
}
