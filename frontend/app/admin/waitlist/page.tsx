"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";

interface WaitlistEntry {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  status: "pending" | "verified" | "rejected";
}

interface WaitlistApiResponse {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  status?: string;
}

interface ApiResponseWrapper {
  status: string;
  data: WaitlistApiResponse[];
}

export default function WaitlistPage() {
  const [waitlistData, setWaitlistData] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const updateWaitlistStatus = async (id: string, newStatus: string) => {
    try {
      setUpdatingStatus(id);
      const response = await apiClient.updateWaitlistStatus(id, newStatus);

      if (response.success) {
        // Update the local state
        setWaitlistData(prevData =>
          prevData.map(entry =>
            entry.id === id
              ? { ...entry, status: newStatus.toLowerCase() as "pending" | "verified" | "rejected" }
              : entry
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

  const fetchWaitlistData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getWaitlistResponses();

      if (response.success && response.data) {
        // Handle nested data structure from API
        const apiData = response.data as unknown as ApiResponseWrapper;
        const waitlistArray = apiData.data || apiData;
        
        // Transform the data to match our interface
        const transformedData = Array.isArray(waitlistArray)
          ? waitlistArray.map((item: WaitlistApiResponse) => ({
              id: item.id,
              email: item.email,
              name: item.name || undefined,
              createdAt: item.createdAt,
              status: (item.status?.toLowerCase() || 'pending') as "pending" | "verified" | "rejected"
            }))
          : [];

        setWaitlistData(transformedData);
      }
    } catch (error) {
      console.error('Failed to fetch waitlist data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitlistData();
  }, []);

  // Filter data based on status and search
  const filteredData = waitlistData.filter((entry) => {
    const matchesStatus = statusFilter === "all" || entry.status === statusFilter;
    const matchesSearch =
      entry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.name && entry.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full p-8 space-y-8 bg-slate-50 dark:bg-[#1a1a1a] text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Waitlist</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Manage and view all waitlist signups</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap items-center">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <SelectItem value="all" className="text-slate-900 dark:text-white">All Status</SelectItem>
            <SelectItem value="pending" className="text-slate-900 dark:text-white">Pending</SelectItem>
            <SelectItem value="verified" className="text-slate-900 dark:text-white">Verified</SelectItem>
            <SelectItem value="rejected" className="text-slate-900 dark:text-white">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by email..."
          className="flex-1 min-w-64 px-4 py-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
        />
        <Button
          onClick={fetchWaitlistData}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2"
        >
          Refresh Data
        </Button>
      </div>

      {/* Waitlist Table */}
      <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">Waitlist Entries</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">All people who have signed up for the waitlist</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-full space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-8 bg-muted rounded animate-pulse" />
                ))}
              </div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-slate-600 dark:text-slate-400">
                {waitlistData.length === 0 ? "No waitlist entries yet" : "No entries match your filters"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 dark:border-slate-700">
                    <TableHead className="text-slate-900 dark:text-slate-100">Email</TableHead>
                    <TableHead className="text-slate-900 dark:text-slate-100">Joined</TableHead>
                    <TableHead className="text-slate-900 dark:text-slate-100">Status</TableHead>
                    <TableHead className="text-slate-900 dark:text-slate-100 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((entry) => (
                    <TableRow key={entry.id} className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50">
                      <TableCell className="text-slate-900 dark:text-slate-100">{entry.email}</TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">{new Date(entry.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            entry.status === "verified"
                              ? "bg-green-600 text-white dark:bg-green-700"
                              : entry.status === "rejected"
                              ? "bg-red-600 text-white dark:bg-red-700"
                              : "bg-yellow-600 text-white dark:bg-yellow-700"
                          }`}
                        >
                          {entry.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
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
                          <DialogContent className="max-w-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            <DialogHeader>
                              <DialogTitle className="text-slate-900 dark:text-white">Waitlist Entry Details</DialogTitle>
                              <DialogDescription className="text-slate-600 dark:text-slate-400">
                                User registration information
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium text-slate-900 dark:text-white mb-1">Email</h4>
                                <p className="text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700/50 p-2 rounded border border-slate-200 dark:border-slate-600">
                                  {entry.email}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium text-slate-900 dark:text-white mb-1">Status</h4>
                                <Badge
                                  className={`${
                                    entry.status === "verified"
                                      ? "bg-green-600 text-white dark:bg-green-700"
                                      : entry.status === "rejected"
                                      ? "bg-red-600 text-white dark:bg-red-700"
                                      : "bg-yellow-600 text-white dark:bg-yellow-700"
                                  }`}
                                >
                                  {entry.status}
                                </Badge>
                              </div>
                              <div>
                                <h4 className="font-medium text-slate-900 dark:text-white mb-1">Joined Date</h4>
                                <p className="text-slate-600 dark:text-slate-400">
                                  {new Date(entry.createdAt).toLocaleString()}
                                </p>
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
                                    const newStatus = entry.status === "pending" ? "verified" : entry.status === "verified" ? "rejected" : "pending";
                                    updateWaitlistStatus(entry.id, newStatus);
                                  }}
                                  disabled={updatingStatus === entry.id}
                                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white disabled:opacity-50"
                                >
                                  {updatingStatus === entry.id ? "Updating..." : (entry.status === "pending" ? "Verify" : entry.status === "verified" ? "Reject" : "Approve")}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
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
