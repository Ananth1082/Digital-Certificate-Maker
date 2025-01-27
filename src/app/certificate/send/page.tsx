"use client";

import { useState } from "react";
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

interface Participant {
  id: string;
  name: string;
  teamName: string;
  emailSent: boolean;
}

// Sample data - replace with your actual data
const sampleData: Participant[] = [
  { id: "001", name: "John Doe", teamName: "Team Alpha", emailSent: true },
  { id: "002", name: "Jane Smith", teamName: "Team Beta", emailSent: false },
  { id: "003", name: "Alex Johnson", teamName: "Team Gamma", emailSent: true },
];

const events = [
  {
    id: "1",
    name: "Hackathon 2024",
    description:
      "Annual coding competition featuring teams from various colleges",
  },
  {
    id: "2",
    name: "Tech Conference",
    description:
      "Industry-leading speakers sharing insights on latest technologies",
  },
  {
    id: "3",
    name: "Workshop",
    description: "Hands-on learning session for emerging technologies",
  },
];

export default function EventTracker() {
  const [selectedEvent, setSelectedEvent] = useState<string>("");

  const selectedEventDetails = events.find(
    (event) => event.id === selectedEvent
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {/* Event Selection Card */}
      <Card>
        <CardHeader>
          <CardTitle>Select Event</CardTitle>
          <CardDescription>
            Choose an event to view its participants and tracking details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedEvent} value={selectedEvent}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select Event" />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedEventDetails && (
            <p className="mt-4 text-sm text-muted-foreground">
              {selectedEventDetails.description}
            </p>
          )}
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
                  <TableHead>Team Name</TableHead>
                  <TableHead className="w-[100px]">Email Sent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleData.map((participant) => (
                  <TableRow key={participant.id}>
                    <TableCell className="font-medium">
                      {participant.id}
                    </TableCell>
                    <TableCell>{participant.name}</TableCell>
                    <TableCell>{participant.teamName}</TableCell>
                    <TableCell>{participant.emailSent ? "✓" : ""}</TableCell>
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
