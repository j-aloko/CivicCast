"use client";

import React, { useState, useEffect, useCallback } from "react";

import { Send, AccountCircle } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useSession } from "next-auth/react";

function CommentsSection({ pollId }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/polls/${pollId}/comments`);
      const data = await response.json();
      if (data.success) {
        setComments(data.data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [pollId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments, pollId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !session) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/polls/${pollId}/comments`, {
        body: JSON.stringify({
          content: newComment,
          parentId: replyingTo,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const data = await response.json();
      if (data.success) {
        setNewComment("");
        setReplyingTo(null);
        fetchComments(); // Refresh comments
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderComment = (comment, depth = 0) => (
    <Box key={comment.id} sx={{ ml: depth * 3 }}>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Avatar src={comment.user.image} sx={{ height: 32, width: 32 }}>
          <AccountCircle />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ alignItems: "center", display: "flex", gap: 1, mb: 0.5 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              {comment.user.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(comment.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          <Typography variant="body2" paragraph>
            {comment.content}
          </Typography>
          {session && depth < 2 && (
            <Button
              size="small"
              onClick={() =>
                setReplyingTo(replyingTo === comment.id ? null : comment.id)
              }
            >
              Reply
            </Button>
          )}
        </Box>
      </Box>

      {/* Reply form */}
      {replyingTo === comment.id && (
        <Box sx={{ mb: 2, ml: 4 }}>
          <form onSubmit={handleSubmitComment}>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Write your reply..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                type="submit"
                variant="contained"
                size="small"
                disabled={isLoading}
                startIcon={
                  isLoading ? <CircularProgress size={16} /> : <Send />
                }
              >
                Reply
              </Button>
              <Button
                size="small"
                onClick={() => {
                  setReplyingTo(null);
                  setNewComment("");
                }}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      )}

      {/* Nested comments */}
      {comment.replies &&
        comment.replies.map((reply) => renderComment(reply, depth + 1))}
    </Box>
  );

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Comments ({comments.length})
        </Typography>

        {/* Add Comment Form */}
        {session ? (
          <form onSubmit={handleSubmitComment}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || !newComment.trim()}
              startIcon={isLoading ? <CircularProgress size={16} /> : <Send />}
            >
              Post Comment
            </Button>
          </form>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please sign in to leave a comment.
          </Typography>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Comments List */}
        {comments.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            py={3}
          >
            No comments yet. Be the first to comment!
          </Typography>
        ) : (
          comments.map((comment) => renderComment(comment))
        )}
      </CardContent>
    </Card>
  );
}

export default CommentsSection;
