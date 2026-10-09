import { format, isToday, isYesterday, isThisYear, formatDistanceToNow } from 'date-fns';

/**
 * Format timestamp for single message bubble, e.g. "10:45 AM"
 */
export const formatMessageTime = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';
  return format(date, 'h:mm a');
};

/**
 * Format timestamp for conversation item in sidebar, e.g. "10:45 AM", "Yesterday", or "12/04/24"
 */
export const formatConversationTime = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  if (isToday(date)) {
    return format(date, 'h:mm a');
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  if (isThisYear(date)) {
    return format(date, 'MMM d');
  }
  return format(date, 'MM/dd/yy');
};

/**
 * Format user's last seen time
 */
export const formatLastSeen = (lastSeenInput, isOnline = false) => {
  if (isOnline) return 'Online';
  if (!lastSeenInput) return 'Offline';

  const date = new Date(lastSeenInput);
  if (isNaN(date.getTime())) return 'Offline';

  if (isToday(date)) {
    return `Last seen today at ${format(date, 'h:mm a')}`;
  }
  if (isYesterday(date)) {
    return `Last seen yesterday at ${format(date, 'h:mm a')}`;
  }

  return `Last seen ${formatDistanceToNow(date, { addSuffix: true })}`;
};

/**
 * Format date divider between groups of messages
 */
export const getMessageDateDivider = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  if (isThisYear(date)) return format(date, 'EEEE, MMMM d');
  return format(date, 'MMMM d, yyyy');
};
