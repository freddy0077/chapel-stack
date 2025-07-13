import { useQuery } from '@apollo/client';
import { ALL_MESSAGES_QUERY, GET_MESSAGE_BY_ID } from '../queries/messageQueries';
import { useAuth } from '@/graphql/hooks/useAuth';

export interface MessageFilterInput {
  organisationId?: string;
  branchId?: string;
  type?: 'email' | 'sms' | 'notification';
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  skip?: number;
  take?: number;
}

export interface Message {
  id: string;
  type: 'email' | 'sms' | 'notification';
  subject?: string;
  preview: string;
  recipientCount: number;
  status: string;
  sentAt?: string;
  createdAt: string;
}

export function useMessages(filter: MessageFilterInput) {
  const { user } = useAuth();
  
  // If no branch is specified but user has branches, use the first one
  const effectiveBranchId = filter.branchId ?? 
    (user?.userBranches && user.userBranches.length > 0 ? 
      user.userBranches[0]?.branch?.id : undefined);
  
  const { data, loading, error, refetch } = useQuery(ALL_MESSAGES_QUERY, {
    variables: { 
      filter: { 
        organisationId: filter.organisationId,
        branchId: effectiveBranchId,
        type: filter.type,
        search: filter.search,
        startDate: filter.startDate,
        endDate: filter.endDate,
        status: filter.status,
        skip: filter.skip || 0,
        take: filter.take || 20
      } 
    },
    skip: !filter.organisationId && !effectiveBranchId,
  });
  
  // Transform the raw message data into a consistent format
  const transformedMessages: Message[] = (data?.allMessages || []).map((msg: any) => {
    // Determine message type
    let type: 'email' | 'sms' | 'notification';
    if ('subject' in msg) {
      type = 'email';
    } else if ('body' in msg) {
      type = 'sms';
    } else {
      type = 'notification';
    }
    
    // Create preview text
    let preview = '';
    if (type === 'email') {
      preview = msg.bodyText || stripHtmlTags(msg.bodyHtml) || '';
    } else if (type === 'sms') {
      preview = msg.body || '';
    } else {
      preview = msg.message || '';
    }
    
    // Truncate preview
    preview = preview.length > 100 ? `${preview.substring(0, 100)}...` : preview;
    
    return {
      id: msg.id,
      type,
      subject: msg.subject || msg.title,
      preview,
      recipientCount: Array.isArray(msg.recipients) ? msg.recipients.length : 0,
      status: msg.status || (msg.isRead ? 'Read' : 'Unread'),
      sentAt: msg.sentAt,
      createdAt: msg.createdAt
    };
  });
  
  return {
    messages: transformedMessages,
    loading,
    error,
    refetch,
    totalCount: data?.messageCounts?.total || 0,
    emailCount: data?.messageCounts?.email || 0,
    smsCount: data?.messageCounts?.sms || 0,
    notificationCount: data?.messageCounts?.notification || 0
  };
}

export function useMessageById(id: string, type: string) {
  const { data, loading, error } = useQuery(GET_MESSAGE_BY_ID, {
    variables: { id, type },
    skip: !id || !type
  });
  
  return {
    message: data?.messageById,
    loading,
    error
  };
}

// Helper function to strip HTML tags
function stripHtmlTags(html?: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}
