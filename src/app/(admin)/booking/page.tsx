import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BookingPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Book an Appointment</CardTitle>
                <CardDescription>
                    Choose your preferred consultation type and time slot.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>Booking form will be implemented here.</p>
            </CardContent>
        </Card>
    );
}
