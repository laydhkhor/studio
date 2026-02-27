import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminBookingPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Manage Appointments</CardTitle>
                <CardDescription>
                    Review and manage all incoming patient consultation requests.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>Appointment management table for doctors will be implemented here.</p>
            </CardContent>
        </Card>
    );
}
