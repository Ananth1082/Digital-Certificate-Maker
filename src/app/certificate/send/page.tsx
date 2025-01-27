"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

interface Participant {
  cid: string;
  id: string;
  name: string;
  issued: boolean;
  email: string;
  college: string;
}

type Event = {
  id: number;
  name: string;
};

export default function EventTracker() {
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [events, setEvents] = useState<Event[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const { toast } = useToast();
  useEffect(() => {
    fetch("http://localhost:4000/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.events);
        console.log(data);
      })
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  const issueCertificates = () => {
    if (!selectedEvent) {
      toast({
        title: "Error",
        description: "No event selected",
        variant: "destructive",
      });
      return;
    }
    fetch(`http://localhost:4000/certificates/${selectedEvent}`, {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) {
          toast({
            title: "Error",
            description: "Failed to issue certificates",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Issued the certificates",
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);

        if (!data.participants) {
          setParticipants([]);
          return;
        }
        setParticipants(data.participants);
      })
      .catch((error) => console.error("Error issuing certificates:", error));
  };

  const changeSelection = (val: string) => {
    setSelectedEvent(val);
    fetch(`http://localhost:4000/event/${val}/participants`)
      .then((res) => {
        if (!res.ok) {
          toast({
            title: "Error",
            description: "Failed to fetch participants",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Fetched the participants",
          });
        }
        return res.json();
      })
      .then((data: { participants: Participant[] }) => {
        if (!data.participants) {
          setParticipants([]);
          return;
        }
        setParticipants(data.participants);
      })
      .catch((error) => {
        console.error("Error fetching participants for event:", error);
        toast({
          title: "Error",
          description: "Failed to fetch participants",
          variant: "destructive",
        });
      });
  };

  const selectedEventDetails = events.find(
    (event) => `${event.id}` === selectedEvent
  );

  const sendEmail = async (details: {
    name: string;
    email: string;
    college: string;
    event: string;
  }) => {
    if (!details.email || !details.name || !details.college || !details.event) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }
    fetch("/api/send-email", {
      method: "POST",
      body: JSON.stringify({
        to: details.email,
        details: {
          name: details.name,
          college: details.college,
          event: details.event,
        },
      }),
    })
      .then((res) => {
        if (res.ok) {
          setParticipants((prev) =>
            prev.map((participant) =>
              participant.email === details.email
                ? { ...participant, issued: true }
                : participant
            )
          );
        }
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        toast({
          title: "Error",
          description: `Failed to send email to ${details.email}`,
          variant: "destructive",
        });
      });
  };
  const sendCertificateEmails = () => {
    if (participants.length === 0) {
      toast({
        title: "Error",
        description: "No participants to send certificates",
        variant: "destructive",
      });
      return;
    }
    if (!selectedEventDetails) {
      toast({
        title: "Error",
        description: "No event selected",
        variant: "destructive",
      });
      return;
    }
    participants.forEach((participant) => {
      if (participant.issued) return;
      sendEmail({
        name: participant.name,
        email: `${participant.email}`,
        college: participant.college,
        event: selectedEventDetails?.name,
      });
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {/* Event Selection Card */}
      <div className="flex gap-4">
        <Toaster />
        <Card className="mt-20">
          <CardHeader>
            <CardTitle>Select Event</CardTitle>
            <CardDescription>
              Choose an event to view its participants and tracking details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={changeSelection} value={selectedEvent}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select Event" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event.id} value={`${event.id}`}>
                    {event.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <Card className="mt-20">
          <CardHeader>
            <CardTitle>Issue Certificates</CardTitle>
            <CardDescription>
              Issue certificates for the people who attended the event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={issueCertificates}> Issue</Button>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-20">
        <CardHeader>
          <CardTitle>Send certificates</CardTitle>
          <CardDescription>
            Send participation certificates to the participant's email. This
            process might take some time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={sendCertificateEmails}>Send</Button>
        </CardContent>
      </Card>
      {/* Participants Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Participants</CardTitle>
          <CardDescription>
            {selectedEventDetails
              ? `Tracking details for ${selectedEventDetails.name}`
              : "Select an event to view participants"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>College</TableHead>
                  <TableHead className="w-[100px]">Email Sent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((participant) => (
                  <TableRow key={participant.id}>
                    <TableCell className="font-medium">
                      {participant.id}
                    </TableCell>
                    <TableCell>{participant.name}</TableCell>
                    <TableCell>{participant.email}</TableCell>
                    <TableCell>{participant.college}</TableCell>
                    <TableCell>{participant.issued ? "✔" : "❌"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
