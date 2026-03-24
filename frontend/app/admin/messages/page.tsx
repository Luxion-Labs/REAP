"use client";

import { useState, useEffect } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: "unread" | "read" | "replied";
}

interface ContactApiResponse {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status?: string;
}

interface ApiResponseWrapper {
  status: string;
  data: ContactApiResponse[];
}

export default function MessagesPage() {
  const [messagesData, setMessagesData] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>("");

  const updateContactStatus = async (id: string, newStatus: string) => {
    try {
      setUpdatingStatus(id);
      const response = await apiClient.updateContactStatus(id, newStatus);

      if (response.success) {
        // Update the local state
        setMessagesData(prevData =>
          prevData.map(message =>
            message.id === id
              ? { ...message, status: newStatus.toLowerCase() as "unread" | "read" | "replied" }
              : message
          )
        );
      } else {
        console.error('Failed to update status:', response.message);
        alert('Failed to update status: ' + response.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status. Please try again.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const fetchMessagesData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getContactResponses();
      console.log('API Response:', response);

      if (response.success && response.data) {
        // Handle nested data structure from API
        const apiData = response.data as unknown as ApiResponseWrapper;
        const messagesArray = apiData.data || apiData;
        
        // Transform the data to match our interface
        const transformedData = Array.isArray(messagesArray)
          ? messagesArray.map((item: ContactApiResponse) => ({
              id: item.id,
              name: item.name,
              email: item.email,
              subject: item.subject,
              message: item.message,
              createdAt: item.createdAt,
              status: (item.status?.toLowerCase() || 'unread') as "unread" | "read" | "replied"
            }))
          : [];

        setMessagesData(transformedData);
      } else {
        console.log('Response not successful or no data:', response);
      }
    } catch (error) {
      console.error('Failed to fetch messages data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessagesData();
  }, []);

  // Filter data based on status and search
  const filteredData = messagesData.filter((message) => {
    const matchesStatus = statusFilter === "all" || message.status === statusFilter;
    const matchesSearch =
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full p-8 space-y-8 bg-slate-50 dark:bg-[#1a1a1a] text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Contact Messages</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Manage and respond to contact form submissions</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap items-center">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <SelectItem value="all" className="text-slate-900 dark:text-white">All Status</SelectItem>
            <SelectItem value="unread" className="text-slate-900 dark:text-white">Unread</SelectItem>
            <SelectItem value="read" className="text-slate-900 dark:text-white">Read</SelectItem>
            <SelectItem value="replied" className="text-slate-900 dark:text-white">Replied</SelectItem>
          </SelectContent>
        </Select>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by email, name, subject, or message..."
          className="flex-1 min-w-64 px-4 py-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
        />
        <Button
          onClick={fetchMessagesData}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2"
        >
          Refresh Data
        </Button>
      </div>

      {/* Messages Table */}
      <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">Messages</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">All contact form submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-full space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                ))}
              </div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-slate-600 dark:text-slate-400">
                {messagesData.length === 0 ? "No messages yet" : "No messages match your filters"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 dark:border-slate-700">
                    <TableHead className="text-slate-900 dark:text-white">Name</TableHead>
                    <TableHead className="text-slate-900 dark:text-white">Email</TableHead>
                    <TableHead className="text-slate-900 dark:text-white">Subject</TableHead>
                    <TableHead className="text-slate-900 dark:text-white">Message</TableHead>
                    <TableHead className="text-slate-900 dark:text-white">Received</TableHead>
                    <TableHead className="text-slate-900 dark:text-white">Status</TableHead>
                    <TableHead className="text-slate-900 dark:text-white text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((message) => (
                    <TableRow key={message.id} className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50">
                      <TableCell className="text-slate-900 dark:text-slate-100">{message.name}</TableCell>
                      <TableCell className="text-slate-900 dark:text-slate-100">{message.email}</TableCell>
                      <TableCell className="text-slate-900 dark:text-slate-100 max-w-xs truncate">{message.subject}</TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400 max-w-xs truncate">
                        {message.message}
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">{new Date(message.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            message.status === "unread"
                              ? "bg-red-600 text-white dark:bg-red-700"
                              : message.status === "read"
                              ? "bg-yellow-600 text-white dark:bg-yellow-700"
                              : "bg-green-600 text-white dark:bg-green-700"
                          }`}
                        >
                          {message.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                              >
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                              <DialogHeader>
                                <DialogTitle className="text-slate-900 dark:text-white">Message Details</DialogTitle>
                                <DialogDescription className="text-slate-600 dark:text-slate-400">
                                  Contact form submission from {message.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium text-slate-900 dark:text-white mb-1">Name</h4>
                                    <p className="text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700/50 p-2 rounded border border-slate-200 dark:border-slate-600">
                                      {message.name}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-slate-900 dark:text-white mb-1">Email</h4>
                                    <p className="text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700/50 p-2 rounded border border-slate-200 dark:border-slate-600">
                                      {message.email}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium text-slate-900 dark:text-white mb-1">Subject</h4>
                                  <p className="text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700/50 p-2 rounded border border-slate-200 dark:border-slate-600">
                                    {message.subject}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-medium text-slate-900 dark:text-white mb-1">Message</h4>
                                  <div className="text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700/50 p-4 rounded border border-slate-200 dark:border-slate-600 whitespace-pre-wrap">
                                    {message.message}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium text-slate-900 dark:text-white mb-1">Status</h4>
                                  <Badge
                                    className={`${
                                      message.status === "unread"
                                        ? "bg-red-600 text-white dark:bg-red-700"
                                        : message.status === "read"
                                        ? "bg-yellow-600 text-white dark:bg-yellow-700"
                                        : "bg-green-600 text-white dark:bg-green-700"
                                    }`}
                                  >
                                    {message.status}
                                  </Badge>
                                </div>
                                <div>
                                  <h4 className="font-medium text-slate-900 dark:text-white mb-1">Received Date</h4>
                                  <p className="text-slate-600 dark:text-slate-400">
                                    {new Date(message.createdAt).toLocaleString()}
                                  </p>
                                </div>

                                {/* Reply Section */}
                                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-medium text-slate-900 dark:text-white">Reply to {message.name}</h4>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        if (showReplyForm === message.id) {
                                          setShowReplyForm(null);
                                          setReplyText("");
                                        } else {
                                          setShowReplyForm(message.id);
                                          setReplyText(`Dear ${message.name},\n\nThank you for your message regarding "${message.subject}".\n\n`);
                                        }
                                      }}
                                      className="border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                                    >
                                      {showReplyForm === message.id ? "Cancel Reply" : "Reply"}
                                    </Button>
                                  </div>

                                  {showReplyForm === message.id && (
                                    <div className="space-y-3">
                                      <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Type your reply here..."
                                        className="w-full h-32 p-3 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 resize-none"
                                      />
                                      <div className="flex gap-2 justify-end">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            setShowReplyForm(null);
                                            setReplyText("");
                                          }}
                                          className="border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          size="sm"
                                          onClick={() => {
                                            // TODO: Implement send reply functionality
                                            alert(`Reply would be sent to ${message.email}:\n\n${replyText}`);
                                            setShowReplyForm(null);
                                            setReplyText("");
                                            // After sending, mark as replied
                                            updateContactStatus(message.id, "replied");
                                          }}
                                          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
                                          disabled={!replyText.trim()}
                                        >
                                          Send Reply
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="flex gap-2 pt-4">
                                  <Button
                                    variant="outline"
                                    className="border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                                  >
                                    Close
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      const newStatus = message.status === "unread" ? "read" : message.status === "read" ? "replied" : "unread";
                                      updateContactStatus(message.id, newStatus);
                                    }}
                                    disabled={updatingStatus === message.id}
                                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white disabled:opacity-50"
                                  >
                                    {updatingStatus === message.id ? "Updating..." : (message.status === "unread" ? "Mark as Read" : message.status === "read" ? "Mark as Replied" : "Mark as Unread")}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowReplyForm(message.id);
                              setReplyText(`Dear ${message.name},\n\nThank you for your message regarding "${message.subject}".\n\n`);
                            }}
                            className="border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            Reply
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
