import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LeftSidebar from '../../components/layout/LeftSidebar';
import Navbar from '../../components/layout/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../components/ui/pagination';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services';
import type { User } from '../../types/api';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const { user } = useAuth();
  const usersPerPage = 10;

  useEffect(() => {
    if (query.trim()) {
      searchUsers(query.trim(), currentPage);
    }
  }, [query, currentPage]);
  const searchUsers = async (searchQuery: string, page: number = 1) => {
    setLoading(true);
    try {
      const response = await userService.searchUsers(searchQuery, page, usersPerPage);
      if (response && response.users) {
        setUsers(response.users);
        setTotalUsers(response.total || response.users.length);
        setTotalPages(Math.ceil((response.total || response.users.length) / usersPerPage));
      } else if (response && response.data?.users) {
        setUsers(response.data.users);
        setTotalUsers(response.data.total || response.data.users.length);
        setTotalPages(
          Math.ceil((response.data.total || response.data.users.length) / usersPerPage)
        );
      } else {
        setUsers([]);
        setTotalUsers(0);
        setTotalPages(1);
      }
    } catch (error) {
      setUsers([]);
      setTotalUsers(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };
  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page.toString());
    setSearchParams(newSearchParams);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <LeftSidebar />
      <div className="ml-60 transition-all duration-300">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Search Results</h1>
            <p className="text-muted-foreground">
              {totalUsers > 0 ? `${totalUsers} results for "${query}"` : `Results for "${query}"`}
            </p>
          </div>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Searching...</p>
            </div>
          ) : users.length > 0 ? (
            <div className="space-y-4">
              {users.map(searchUser => (
                <Card key={searchUser._id} className="border-none shadow-soft bg-gradient-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={searchUser.avatar} alt={searchUser.username} />
                          <AvatarFallback className="bg-gradient-primary text-white">
                            {searchUser.firstName?.[0] || searchUser.username?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">
                            {searchUser.firstName} {searchUser.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">@{searchUser.username}</p>
                          <div className="flex items-center space-x-3 mt-1 text-xs text-muted-foreground">
                            <span>{searchUser.followersCount || 0} followers</span>
                            <span>{searchUser.followingCount || 0} following</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/u/${searchUser.username}`)}
                      >
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="cursor-pointer"
                          />
                        </PaginationItem>
                      )}
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => handlePageChange(pageNum)}
                              isActive={currentPage === pageNum}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      {currentPage < totalPages && (
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="cursor-pointer"
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          ) : query ? (
            <Card className="border-none shadow-soft bg-gradient-card">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No users found</h3>
                <p className="text-muted-foreground">
                  Try searching with a different username or keyword.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-none shadow-soft bg-gradient-card">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">👋</div>
                <h3 className="text-xl font-semibold mb-2">Start searching</h3>
                <p className="text-muted-foreground">
                  Enter a username in the search bar to find users.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
