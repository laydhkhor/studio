"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { doctorDetails } from "@/lib/placeholder-data";
import { generateSeoContentAction } from "@/app/actions/seo-actions";
import type { GenerateSeoContentOutput } from "@/ai/flows/seo-content-generator";
import { Loader2, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  pageContent: z.string().min(100, "Page content must be at least 100 characters."),
  targetKeywords: z.string().min(3, "Please provide at least one keyword."),
  location: z.string().min(3, "Location is required for local SEO."),
});

type FormValues = z.infer<typeof formSchema>;

export default function SeoGeneratorForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateSeoContentOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pageContent: "",
      targetKeywords: "Doctor in Mahishadal, West Bengal healthcare",
      location: doctorDetails.targetSeoLocations,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResult(null);

    const keywordsArray = data.targetKeywords.split(",").map((kw) => kw.trim());
    
    const response = await generateSeoContentAction({
        ...data,
        targetKeywords: keywordsArray
    });

    setIsLoading(false);
    if (response.success && response.data) {
        setResult(response.data);
        toast({ title: "Success", description: "SEO content generated successfully." });
    } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: response.error || "Failed to generate SEO content.",
        });
    }
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${fieldName} copied to clipboard.` });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="pageContent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Page Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste the main content of your web page here..."
                    className="min-h-[200px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The main text from the page you want to optimize.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="targetKeywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Keywords</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., doctor, clinic, Mahishadal" {...field} />
                </FormControl>
                <FormDescription>
                  Comma-separated keywords you want to rank for.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Mahishadal, West Bengal" {...field} />
                </FormControl>
                <FormDescription>
                  The geographical area for local SEO.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="font-ui">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate SEO Content
          </Button>
        </form>
      </Form>
      
      <div className="space-y-4">
        <h3 className="font-headline text-xl font-semibold">Generated Content</h3>
        {isLoading && (
            <div className="flex items-center justify-center h-64 border rounded-lg bg-muted">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )}
        {result && (
          <Card className="bg-muted/50">
            <CardContent className="p-6 space-y-4">
               <div>
                  <div className="flex justify-between items-center mb-1">
                      <h4 className="font-semibold font-ui">Title Tag</h4>
                      <Button variant="ghost" size="icon" onClick={() => handleCopy(result.titleTag, 'Title Tag')}><Copy className="h-4 w-4"/></Button>
                  </div>
                  <p className="text-sm p-3 rounded-md bg-background border">{result.titleTag}</p>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                      <h4 className="font-semibold font-ui">Meta Description</h4>
                       <Button variant="ghost" size="icon" onClick={() => handleCopy(result.metaDescription, 'Meta Description')}><Copy className="h-4 w-4"/></Button>
                  </div>
                  <p className="text-sm p-3 rounded-md bg-background border">{result.metaDescription}</p>
                </div>
                 <div>
                  <div className="flex justify-between items-center mb-1">
                      <h4 className="font-semibold font-ui">JSON-LD Structured Schema</h4>
                       <Button variant="ghost" size="icon" onClick={() => handleCopy(result.structuredSchema, 'Schema')}><Copy className="h-4 w-4"/></Button>
                  </div>
                  <pre className="text-sm p-3 rounded-md bg-background border overflow-x-auto">
                    <code>{JSON.stringify(JSON.parse(result.structuredSchema), null, 2)}</code>
                  </pre>
                </div>
            </CardContent>
          </Card>
        )}
        {!isLoading && !result && (
            <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-muted text-center">
                <p className="text-muted-foreground">Generated content will appear here.</p>
            </div>
        )}
      </div>
    </div>
  );
}
