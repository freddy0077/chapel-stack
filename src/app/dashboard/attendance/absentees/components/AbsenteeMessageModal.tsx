'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SEND_ABSENTEE_MESSAGE } from '@/graphql/mutations/absenteeMutations';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Mail, Send, Smartphone } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AbsenteeMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMembers: any[];
  onSuccess: () => void;
}

const MESSAGE_TEMPLATES = {
  missedYou: {
    name: 'We Missed You',
    message: 'Hi {firstName}, we missed you at church today! Hope everything is okay. Looking forward to seeing you soon! 🙏',
    subject: 'We Missed You at Church',
  },
  checkIn: {
    name: 'Check In',
    message: 'Hi {firstName}, just checking in! We noticed you weren\'t at church recently. Is there anything we can pray for or help with?',
    subject: 'Checking In With You',
  },
  comeback: {
    name: 'Come Back Soon',
    message: 'Hi {firstName}, we\'d love to see you back at church! Let us know if there\'s anything we can do to support you. 💙',
    subject: 'We\'d Love to See You Back',
  },
};

export default function AbsenteeMessageModal({
  isOpen,
  onClose,
  selectedMembers,
  onSuccess,
}: AbsenteeMessageModalProps) {
  const { organisationId, branchId } = useOrganisationBranch();
  const [messageType, setMessageType] = useState<'SMS' | 'EMAIL'>('SMS');
  const [template, setTemplate] = useState<keyof typeof MESSAGE_TEMPLATES>('missedYou');
  const [subject, setSubject] = useState(MESSAGE_TEMPLATES.missedYou.subject);
  const [message, setMessage] = useState(MESSAGE_TEMPLATES.missedYou.message);

  const [sendMessage, { loading }] = useMutation(SEND_ABSENTEE_MESSAGE);

  const handleTemplateChange = (value: keyof typeof MESSAGE_TEMPLATES) => {
    setTemplate(value);
    setMessage(MESSAGE_TEMPLATES[value].message);
    setSubject(MESSAGE_TEMPLATES[value].subject);
  };

  const personalizeMessage = (text: string, member: any) => {
    return text
      .replace(/{firstName}/g, member.firstName)
      .replace(/{lastName}/g, member.lastName)
      .replace(/{fullName}/g, `${member.firstName} ${member.lastName}`);
  };

  const handleSend = async () => {
    try {
      const memberIds = selectedMembers.map((m) => m.member.id);
      
      console.log('Sending message with:', {
        organisationId,
        branchId,
        memberIds,
        messageType,
        subject: messageType === 'EMAIL' ? subject : undefined,
        message,
      });

      await sendMessage({
        variables: {
          input: {
            organisationId,
            branchId,
            memberIds,
            messageType,
            subject: messageType === 'EMAIL' ? subject : undefined,
            message,
          },
        },
      });

      toast.success(`Messages sent to ${selectedMembers.length} members!`);
      onSuccess();
    } catch (error: any) {
      console.error('Send message error:', error);
      toast.error(error.message || 'Failed to send messages');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Message {selectedMembers.length} Absentees
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Message Type Selector */}
          <div className="space-y-2">
            <Label>Message Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={messageType === 'SMS' ? 'default' : 'outline'}
                onClick={() => setMessageType('SMS')}
                className="flex-1"
              >
                <Smartphone className="h-4 w-4 mr-2" />
                SMS
              </Button>
              <Button
                type="button"
                variant={messageType === 'EMAIL' ? 'default' : 'outline'}
                onClick={() => setMessageType('EMAIL')}
                className="flex-1"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </div>
          </div>

          {/* Template Selector */}
          <div className="space-y-2">
            <Label>Quick Templates</Label>
            <Select value={template} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(MESSAGE_TEMPLATES).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject (Email only) */}
          {messageType === 'EMAIL' && (
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject..."
              />
            </div>
          )}

          {/* Message Composer */}
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              rows={6}
              className="resize-none"
            />
            <p className="text-sm text-gray-500">
              Available tokens: {'{firstName}'}, {'{lastName}'}, {'{fullName}'}
            </p>
          </div>

          {/* Preview */}
          {selectedMembers.length > 0 && (
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 text-sm text-gray-700">
                  Preview (first recipient)
                </h4>
                {messageType === 'EMAIL' && (
                  <p className="text-sm font-semibold mb-2">
                    Subject: {personalizeMessage(subject, selectedMembers[0].member)}
                  </p>
                )}
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {personalizeMessage(message, selectedMembers[0].member)}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Recipients List */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2 text-sm text-gray-700">
                Recipients ({selectedMembers.length})
              </h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {selectedMembers.map((absentee) => (
                  <div
                    key={absentee.member.id}
                    className="text-sm text-gray-600 flex items-center justify-between"
                  >
                    <span>
                      {absentee.member.firstName} {absentee.member.lastName}
                    </span>
                    <span className="text-xs text-gray-400">
                      {messageType === 'SMS'
                        ? absentee.member.phoneNumber || 'No phone'
                        : absentee.member.email || 'No email'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={loading || !message.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send to {selectedMembers.length} Members
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
