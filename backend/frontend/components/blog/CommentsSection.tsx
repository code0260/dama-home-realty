'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Reply, Flag, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
// Simple toast notification - replace with a proper toast library
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  if (typeof window !== 'undefined') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
};

interface Comment {
  id: number;
  author: {
    name: string;
    avatar?: string | null;
  };
  content: string;
  date: string;
  replies?: Comment[];
  likes?: number;
}

interface CommentsSectionProps {
  articleId: number;
  className?: string;
}

// Mock comments data - replace with actual API call
const mockComments: Comment[] = [
  {
    id: 1,
    author: {
      name: 'Ahmed Hassan',
      avatar: null,
    },
    content: 'Great article! Very informative and well-written. Thank you for sharing.',
    date: new Date().toISOString(),
    likes: 5,
    replies: [
      {
        id: 2,
        author: {
          name: 'Dama Home Team',
          avatar: null,
        },
        content: 'Thank you for your feedback! We appreciate your support.',
        date: new Date().toISOString(),
        likes: 2,
      },
    ],
  },
  {
    id: 3,
    author: {
      name: 'Sarah Ali',
      avatar: null,
    },
    content: 'This helped me understand the real estate market better. Looking forward to more articles!',
    date: new Date(Date.now() - 86400000).toISOString(),
    likes: 3,
  },
];

export function CommentsSection({ articleId, className }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState({ name: '', email: '', content: '' });
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.name || !newComment.email || !newComment.content) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const comment: Comment = {
        id: comments.length + 1,
        author: {
          name: newComment.name,
          avatar: null,
        },
        content: newComment.content,
        date: new Date().toISOString(),
        likes: 0,
      };
      
      setComments([...comments, comment]);
      setNewComment({ name: '', email: '', content: '' });
      setLoading(false);
      showToast('Comment submitted successfully!', 'success');
    }, 500);
  };

  const handleSubmitReply = async (parentId: number) => {
    if (!replyContent.trim()) {
      showToast('Please enter a reply', 'error');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setComments(comments.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [
              ...(comment.replies || []),
              {
                id: (comment.replies?.length || 0) + 1,
                author: {
                  name: 'You',
                  avatar: null,
                },
                content: replyContent,
                date: new Date().toISOString(),
                likes: 0,
              },
            ],
          };
        }
        return comment;
      }));
      
      setReplyContent('');
      setReplyingTo(null);
      setLoading(false);
      showToast('Reply submitted successfully!', 'success');
    }, 500);
  };

  const handleLike = (commentId: number, isReply: boolean = false, parentId?: number) => {
    if (isReply && parentId) {
      setComments(comments.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies?.map((reply) =>
              reply.id === commentId
                ? { ...reply, likes: (reply.likes || 0) + 1 }
                : reply
            ),
          };
        }
        return comment;
      }));
    } else {
      setComments(comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, likes: (comment.likes || 0) + 1 }
          : comment
      ));
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className={cn('border-2 border-gray-200 dark:border-primary-700', className)}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary dark:text-white flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-secondary" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="space-y-4 p-4 bg-gray-50 dark:bg-primary-800 rounded-lg">
          <h3 className="font-semibold text-primary dark:text-white mb-3">Leave a Comment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Your Name"
              value={newComment.name}
              onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
              required
            />
            <Input
              type="email"
              placeholder="Your Email"
              value={newComment.email}
              onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
              required
            />
          </div>
          <Textarea
            placeholder="Write your comment here..."
            value={newComment.content}
            onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
            rows={4}
            required
          />
          <Button type="submit" disabled={loading} className="bg-secondary hover:bg-secondary/90">
            <Send className="w-4 h-4 mr-2" />
            {loading ? 'Submitting...' : 'Post Comment'}
          </Button>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-4">
              {/* Main Comment */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex gap-4"
              >
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarImage src={comment.author.avatar || undefined} />
                  <AvatarFallback className="bg-secondary/10 text-secondary">
                    {getInitials(comment.author.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-primary dark:text-white">
                      {comment.author.name}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {format(new Date(comment.date), 'MMM dd, yyyy')}
                    </Badge>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <button
                      onClick={() => handleLike(comment.id)}
                      className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-secondary transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      {comment.likes || 0}
                    </button>
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-secondary transition-colors"
                    >
                      <Reply className="w-4 h-4" />
                      Reply
                    </button>
                  </div>

                  {/* Reply Form */}
                  <AnimatePresence>
                    {replyingTo === comment.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 p-4 bg-gray-50 dark:bg-primary-900 rounded-lg space-y-2"
                      >
                        <Textarea
                          placeholder="Write your reply..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          rows={3}
                        />
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSubmitReply(comment.id)}
                            disabled={loading}
                            className="bg-secondary hover:bg-secondary/90"
                          >
                            <Send className="w-3 h-3 mr-1" />
                            Reply
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyContent('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-8 mt-4 space-y-4 border-l-2 border-gray-200 dark:border-primary-700 pl-4">
                      {comment.replies.map((reply) => (
                        <motion.div
                          key={reply.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex gap-3"
                        >
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarImage src={reply.author.avatar || undefined} />
                            <AvatarFallback className="bg-secondary/10 text-secondary text-xs">
                              {getInitials(reply.author.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <h5 className="font-semibold text-sm text-primary dark:text-white">
                                {reply.author.name}
                              </h5>
                              <Badge variant="outline" className="text-xs">
                                {format(new Date(reply.date), 'MMM dd')}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {reply.content}
                            </p>
                            <button
                              onClick={() => handleLike(reply.id, true, comment.id)}
                              className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 hover:text-secondary transition-colors"
                            >
                              <Heart className="w-3 h-3" />
                              {reply.likes || 0}
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

