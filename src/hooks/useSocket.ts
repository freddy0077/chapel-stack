import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContextEnhanced';

interface UseSocketOptions {
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  error: Error | null;
  connect: () => void;
  disconnect: () => void;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

export function useSocket(
  namespace: string = '',
  options: UseSocketOptions = {}
): UseSocketReturn {
  const { state } = useAuth();
  const token = state.token;
  
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const {
    autoConnect = true,
    reconnection = true,
    reconnectionAttempts = 5,
    reconnectionDelay = 1000,
  } = options;

  const connect = useCallback(() => {
    if (!token) {
      setError(new Error('No authentication token available'));
      return;
    }

    if (socketRef.current?.connected) {
      return;
    }

    try {
      const socketUrl = namespace ? `${SOCKET_URL}/${namespace}` : SOCKET_URL;
      
      const newSocket = io(socketUrl, {
        auth: { token },
        reconnection,
        reconnectionAttempts,
        reconnectionDelay,
        transports: ['websocket', 'polling'],
      });

      // Connection event handlers
      newSocket.on('connect', () => {
        console.log(`✅ Socket connected to ${namespace || 'default'} namespace`);
        setIsConnected(true);
        setError(null);
      });

      newSocket.on('disconnect', (reason) => {
        console.log(`❌ Socket disconnected from ${namespace || 'default'}: ${reason}`);
        setIsConnected(false);
      });

      newSocket.on('connect_error', (err) => {
        console.error(`🔴 Socket connection error:`, err);
        setError(err);
        setIsConnected(false);
      });

      newSocket.on('error', (err) => {
        console.error(`🔴 Socket error:`, err);
        setError(err);
      });

      // Handle successful connection confirmation
      newSocket.on('connected', (data) => {
        console.log('✅ Connection confirmed:', data);
      });

      socketRef.current = newSocket;
      setSocket(newSocket);
    } catch (err) {
      console.error('Failed to create socket:', err);
      setError(err as Error);
    }
  }, [token, namespace, reconnection, reconnectionAttempts, reconnectionDelay]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    if (autoConnect && token) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, token, connect, disconnect]);

  return {
    socket,
    isConnected,
    error,
    connect,
    disconnect,
  };
}

// Specialized hook for communications namespace
export function useCommunicationsSocket(options?: UseSocketOptions): UseSocketReturn {
  return useSocket('communications', options);
}

// Hook for conversation-specific events
export function useConversationSocket(conversationId: string | null) {
  const { socket, isConnected } = useCommunicationsSocket();
  const [messages, setMessages] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!socket || !isConnected || !conversationId) return;

    // Join conversation room
    socket.emit('conversation:join', { conversationId });

    // Listen for new messages
    const handleNewMessage = (message: any) => {
      if (message.conversationId === conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    // Listen for typing indicators
    const handleTyping = (data: { conversationId: string; userId: string; isTyping: boolean }) => {
      if (data.conversationId === conversationId) {
        setTypingUsers((prev) => {
          const next = new Set(prev);
          if (data.isTyping) {
            next.add(data.userId);
          } else {
            next.delete(data.userId);
          }
          return next;
        });
      }
    };

    // Listen for read receipts
    const handleMessageRead = (data: any) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === data.messageId ? { ...msg, readAt: data.readAt } : msg
          )
        );
      }
    };

    socket.on('message:new', handleNewMessage);
    socket.on('conversation:typing', handleTyping);
    socket.on('message:read', handleMessageRead);

    return () => {
      socket.emit('conversation:leave', { conversationId });
      socket.off('message:new', handleNewMessage);
      socket.off('conversation:typing', handleTyping);
      socket.off('message:read', handleMessageRead);
    };
  }, [socket, isConnected, conversationId]);

  const sendTypingIndicator = useCallback(
    (isTyping: boolean) => {
      if (socket && conversationId) {
        socket.emit('conversation:typing', { conversationId, isTyping });
      }
    },
    [socket, conversationId]
  );

  return {
    socket,
    isConnected,
    messages,
    typingUsers: Array.from(typingUsers),
    sendTypingIndicator,
  };
}
