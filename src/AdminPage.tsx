import { useState, useEffect } from 'react';
import { NavigationBar } from './components/NavigationBar';
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { getPendingUsers, approveUser, rejectUser } from './utils/authContext';
import { toast } from 'sonner@2.0.3';
import { 
  Users, 
  MessageSquare, 
  Calendar,
  ShoppingBag,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Mail,
  GraduationCap,
  BadgeCheck,
  TrendingUp,
  Clock
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './components/ui/table';

const adminStats = {
  totalUsers: 1247,
  pendingApprovals: 8,
  activePosts: 156,
  upcomingEvents: 12,
  activeListings: 43,
  reportedContent: 3
};

const pendingUsers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    appliedDate: '2025-10-30',
    status: 'Pending',
    criteria: {
      campusEmail: true,
      studentId: true,
      enrollmentVerified: true,
      profileComplete: true
    },
    major: 'Business Administration',
    graduationYear: '2027',
    reason: 'New student transfer from State University'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    appliedDate: '2025-10-30',
    status: 'Pending',
    criteria: {
      campusEmail: true,
      studentId: true,
      enrollmentVerified: false,
      profileComplete: true
    },
    major: 'Mechanical Engineering',
    graduationYear: '2026',
    reason: 'Current student - Fall 2025 enrollment'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    appliedDate: '2025-10-29',
    status: 'Pending',
    criteria: {
      campusEmail: true,
      studentId: true,
      enrollmentVerified: true,
      profileComplete: false
    },
    major: 'Psychology',
    graduationYear: '2025',
    reason: 'Alumni verification pending'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    appliedDate: '2025-10-29',
    status: 'Pending',
    criteria: {
      campusEmail: true,
      studentId: true,
      enrollmentVerified: true,
      profileComplete: true
    },
    major: 'Computer Science',
    graduationYear: '2026',
    reason: 'New student - Spring 2026 enrollment'
  },
  {
    id: '5',
    name: 'Jessica Martinez',
    email: 'jessica.martinez@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80',
    appliedDate: '2025-10-28',
    status: 'Pending',
    criteria: {
      campusEmail: true,
      studentId: false,
      enrollmentVerified: true,
      profileComplete: true
    },
    major: 'Marketing',
    graduationYear: '2027',
    reason: 'Current student - verification needed'
  }
];

const recentReports = [
  {
    id: '1',
    type: 'Post',
    title: 'Inappropriate language in community post',
    reportedBy: 'Anonymous',
    date: '2025-10-30',
    status: 'Under Review'
  },
  {
    id: '2',
    type: 'Marketplace',
    title: 'Suspected scam listing - iPhone 15 Pro',
    reportedBy: 'Anonymous',
    date: '2025-10-29',
    status: 'Under Review'
  },
  {
    id: '3',
    type: 'Post',
    title: 'Spam content',
    reportedBy: 'Anonymous',
    date: '2025-10-28',
    status: 'Resolved'
  }
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('approvals');
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    // Load pending users from auth system
    loadPendingUsers();
  }, []);

  const loadPendingUsers = () => {
    const pending = getPendingUsers();
    // For demo purposes, if there are no real pending users, show the mock data
    if (pending.length === 0) {
      setUsers(pendingUsers);
    } else {
      setUsers(pending);
    }
  };

  const handleApprove = (userId: string) => {
    approveUser(userId);
    loadPendingUsers();
    toast.success('User approved successfully! They can now access Campus Connect.');
  };

  const handleReject = (userId: string) => {
    rejectUser(userId);
    loadPendingUsers();
    toast.error('User application rejected');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCriteriaProgress = (criteria: any) => {
    const total = Object.keys(criteria).length;
    const completed = Object.values(criteria).filter(Boolean).length;
    return { completed, total, percentage: (completed / total) * 100 };
  };

  return (
    <div className="min-h-screen bg-white">
      <NavigationBar activeTab="admin" />
      
      {/* Main Content */}
      <main className="max-w-[960px] mx-auto px-4 sm:px-6 py-6">
        {/* Header - Threads Style */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-[Bayon] mb-1">Admin Panel</h1>
          <p className="text-[#666] text-sm font-[Roboto]">Manage users, content, and platform settings</p>
        </div>

        {/* Stats Grid */}
        <div className="flex items-stretch bg-white mb-8 gap-2 p-4">
          <div className="flex flex-col items-center justify-center gap-2 flex-1 px-2 py-4 border border-[#6366f1] rounded-2xl bg-white hover:bg-[#6366f1]/5 transition-all min-h-[130px]">
            <div className="w-12 h-12 flex items-center justify-center">
              <Users className="w-6 h-6 text-[#6366f1]" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-[#111]">{adminStats.totalUsers}</div>
              <div className="text-xs text-[#666] mt-1 font-[Roboto]">Total Users</div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 flex-1 px-2 py-4 border border-[#d97706] rounded-2xl bg-white hover:bg-[#d97706]/5 transition-all min-h-[130px]">
            <div className="w-12 h-12 flex items-center justify-center">
              <Clock className="w-6 h-6 text-[#d97706]" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-[#111]">{adminStats.pendingApprovals}</div>
              <div className="text-xs text-[#666] mt-1 font-[Roboto]">Pending Approvals</div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 flex-1 px-2 py-4 border border-[#059669] rounded-2xl bg-white hover:bg-[#059669]/5 transition-all min-h-[130px]">
            <div className="w-12 h-12 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-[#059669]" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-[#111]">{adminStats.activePosts}</div>
              <div className="text-xs text-[#666] mt-1 font-[Roboto]">Active Posts</div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 flex-1 px-2 py-4 border border-[#dc2626] rounded-2xl bg-white hover:bg-[#dc2626]/5 transition-all min-h-[130px]">
            <div className="w-12 h-12 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-[#dc2626]" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-[#111]">{adminStats.upcomingEvents}</div>
              <div className="text-xs text-[#666] mt-1 font-[Roboto]">Upcoming Events</div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 flex-1 px-2 py-4 border border-[#8b5cf6] rounded-2xl bg-white hover:bg-[#8b5cf6]/5 transition-all min-h-[130px]">
            <div className="w-12 h-12 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-[#8b5cf6]" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-[#111]">{adminStats.activeListings}</div>
              <div className="text-xs text-[#666] mt-1 font-[Roboto]">Active Listings</div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 flex-1 px-2 py-4 border border-[#dc2626] rounded-2xl bg-white hover:bg-[#dc2626]/5 transition-all min-h-[130px]">
            <div className="w-12 h-12 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-[#dc2626]" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-[#111]">{adminStats.reportedContent}</div>
              <div className="text-xs text-[#666] mt-1 font-[Roboto]">Reports</div>
            </div>
          </div>
        </div>

        {/* Tabs - Underline Style */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-transparent border-0 p-0 h-auto justify-start gap-8 mb-6 border-b border-[#f0f0f0]">
            <TabsTrigger 
              value="approvals" 
              className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-0 pb-3 data-[state=active]:shadow-none font-[Roboto] gap-2"
            >
              <BadgeCheck className="w-4 h-4" />
              Pending Approvals ({users.length})
            </TabsTrigger>
            <TabsTrigger 
              value="reports" 
              className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-0 pb-3 data-[state=active]:shadow-none font-[Roboto] gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Reports ({recentReports.filter(r => r.status === 'Under Review').length})
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-0 pb-3 data-[state=active]:shadow-none font-[Roboto] gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Pending Approvals */}
          <TabsContent value="approvals">
            <div>
              {users.map((user) => {
                const progress = getCriteriaProgress(user.criteria);
                const isFullyQualified = progress.percentage === 100;
                
                return (
                  <div key={user.id} className="border-b border-[#f0f0f0] p-5 sm:p-6 bg-white hover:bg-[#fafafa] transition-colors">
                    <div className="flex flex-col sm:flex-row gap-5">
                      {/* User Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="w-16 h-16 border-2 border-white">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white font-semibold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <h3 className="text-[#111] font-semibold mb-1 font-[Roboto]">{user.name}</h3>
                          <div className="flex flex-col gap-1 text-sm text-[#666] mb-3">
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-4 h-4" />
                              <span className="font-[Roboto]">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <GraduationCap className="w-4 h-4" />
                              <span className="font-[Roboto]">{user.major} • Class of {user.graduationYear}</span>
                            </div>
                          </div>
                          
                          <div className="bg-[#f8f9fb] p-3 mb-3 border-t border-b border-[#f0f0f0]">
                            <div className="text-xs text-[#666] mb-1 font-semibold font-[Roboto]">Application Reason:</div>
                            <div className="text-sm text-[#111] font-[Roboto]">{user.reason}</div>
                          </div>

                          {/* Verification Criteria */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-[#666] font-semibold font-[Roboto]">Verification Criteria</span>
                              <span className="text-sm text-[#111] font-semibold font-[Roboto]">
                                {progress.completed}/{progress.total} completed
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div className={`flex items-center gap-2 text-sm ${user.criteria.campusEmail ? 'text-[#059669]' : 'text-[#dc2626]'}`}>
                                {user.criteria.campusEmail ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : (
                                  <XCircle className="w-4 h-4" />
                                )}
                                <span className="font-[Roboto]">Campus Email Verified</span>
                              </div>
                              
                              <div className={`flex items-center gap-2 text-sm ${user.criteria.studentId ? 'text-[#059669]' : 'text-[#dc2626]'}`}>
                                {user.criteria.studentId ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : (
                                  <XCircle className="w-4 h-4" />
                                )}
                                <span className="font-[Roboto]">Student ID Provided</span>
                              </div>
                              
                              <div className={`flex items-center gap-2 text-sm ${user.criteria.enrollmentVerified ? 'text-[#059669]' : 'text-[#dc2626]'}`}>
                                {user.criteria.enrollmentVerified ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : (
                                  <XCircle className="w-4 h-4" />
                                )}
                                <span className="font-[Roboto]">Enrollment Verified</span>
                              </div>
                              
                              <div className={`flex items-center gap-2 text-sm ${user.criteria.profileComplete ? 'text-[#059669]' : 'text-[#dc2626]'}`}>
                                {user.criteria.profileComplete ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : (
                                  <XCircle className="w-4 h-4" />
                                )}
                                <span className="font-[Roboto]">Profile Complete</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex sm:flex-col gap-2 sm:w-[140px] shrink-0">
                        <Badge className="bg-[#fef3c7] text-[#d97706] border-[#d97706]/20 hover:bg-[#fef3c7] text-xs px-2 py-1 self-start mb-2 font-[Roboto]">
                          Applied {formatDate(user.appliedDate)}
                        </Badge>
                        
                        {isFullyQualified && (
                          <Badge className="bg-[#dcfce7] text-[#059669] border-[#059669]/20 hover:bg-[#dcfce7] text-xs px-2 py-1 self-start mb-2 font-[Roboto]">
                            Fully Qualified
                          </Badge>
                        )}
                        
                        <Button 
                          onClick={() => handleApprove(user.id)}
                          className="bg-[rgb(0,0,0)] hover:bg-[#047857] text-white px-4 py-2 gap-2 w-full font-semibold font-[Roboto]"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </Button>
                        
                        <Button 
                          onClick={() => handleReject(user.id)}
                          className="bg-[rgba(255,10,10,0.2)] border border-[#f0f0f0] text-[#dc2626] hover:bg-[#fef2f2] px-4 py-2 gap-2 w-full font-semibold font-[Roboto]"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {users.length === 0 && (
                <div className="p-8 bg-white">
                  <div className="text-center text-[#666]">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-[#059669]" />
                    <p className="font-semibold">No pending approvals at this time</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports">
            <Card className="border-t border-b border-l-0 border-r-0 border-[#f0f0f0] overflow-hidden bg-white rounded-[0px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#f0f0f0]">
                    <TableHead className="text-[#111] font-semibold font-[Roboto] text-center">Type</TableHead>
                    <TableHead className="text-[#111] font-semibold font-[Roboto] text-center">Description</TableHead>
                    <TableHead className="text-[#111] font-semibold font-[Roboto]">Reported By</TableHead>
                    <TableHead className="text-[#111] font-semibold font-[Roboto] text-center">Date</TableHead>
                    <TableHead className="text-[#111] font-semibold font-[Roboto] text-center">Status</TableHead>
                    <TableHead className="text-[#111] font-semibold font-[Roboto] text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentReports.map((report) => (
                    <TableRow key={report.id} className="border-[#f0f0f0]">
                      <TableCell className="text-center">
                        <Badge className="bg-[#f8f9fb] text-[#666] border-[#f0f0f0] hover:bg-[#f8f9fb] font-[Roboto]">
                          {report.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#111] font-[Roboto]">{report.title}</TableCell>
                      <TableCell className="text-[#666] font-[Roboto] text-center">{report.reportedBy}</TableCell>
                      <TableCell className="text-[#666] font-[Roboto] text-center">{formatDate(report.date)}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={
                          report.status === 'Under Review' 
                            ? 'bg-[#fef3c7] text-[#d97706] border-[#d97706]/20 hover:bg-[#fef3c7] font-[Roboto]'
                            : 'bg-[#dcfce7] text-[#059669] border-[#059669]/20 hover:bg-[#dcfce7] font-[Roboto]'
                        }>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button className="bg-white border border-[#f0f0f0] text-[#111] hover:bg-[#f8f9fb] px-3 py-1 text-sm font-semibold font-[Roboto]">
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-6 border-[#f0f0f0] bg-white">
                <h3 className="text-[#111] font-semibold mb-4">User Growth</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#666] text-sm">This Month</span>
                    <span className="text-[#111] font-semibold">+87 users</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#666] text-sm">Last Month</span>
                    <span className="text-[#666]">+64 users</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#059669] font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    <span>35% increase</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-[#f0f0f0] bg-white">
                <h3 className="text-[#111] font-semibold mb-4">Platform Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#666] text-sm">Daily Active Users</span>
                    <span className="text-[#111] font-semibold">423</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#666] text-sm">Posts This Week</span>
                    <span className="text-[#111] font-semibold">89</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#666] text-sm">Events Created</span>
                    <span className="text-[#111] font-semibold">12</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-[#f0f0f0] bg-white">
                <h3 className="text-[#111] font-semibold mb-4">Marketplace Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#666] text-sm">Active Listings</span>
                    <span className="text-[#111] font-semibold">43</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#666] text-sm">Completed Sales</span>
                    <span className="text-[#111] font-semibold">128</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#666] text-sm">Avg. Sale Price</span>
                    <span className="text-[#111] font-semibold">$67</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-[#f0f0f0] bg-white">
                <h3 className="text-[#111] font-semibold mb-4">Content Moderation</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#666] text-sm">Reports Resolved</span>
                    <span className="text-[#111] font-semibold">47</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#666] text-sm">Avg. Response Time</span>
                    <span className="text-[#111] font-semibold">2.3 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#666] text-sm">Content Removed</span>
                    <span className="text-[#111] font-semibold">5</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}