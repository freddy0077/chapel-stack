import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Save, X } from 'lucide-react';
import { ADD_EVENT_NOTES } from '../../graphql/mutations/eventMutations';
import { GET_EVENT_BY_ID } from '../../graphql/queries/eventQueries';

interface EventNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  existingNotes?: string;
}

export const EventNotesModal: React.FC<EventNotesModalProps> = ({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  existingNotes = '',
}) => {
  const [notes, setNotes] = useState(existingNotes);
  const [error, setError] = useState<string | null>(null);

  const [addEventNotes, { loading }] = useMutation(ADD_EVENT_NOTES, {
    refetchQueries: [
      {
        query: GET_EVENT_BY_ID,
        variables: { id: eventId },
      },
    ],
    onCompleted: () => {
      onClose();
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!notes.trim()) {
      setError('Please enter some notes before saving.');
      return;
    }

    try {
      await addEventNotes({
        variables: {
          addEventNotesInput: {
            eventId,
            postEventNotes: notes.trim(),
          },
        },
      });
    } catch (err) {
      // Error is handled by onError callback
      console.error('Error adding event notes:', err);
    }
  };

  const handleClose = () => {
    setNotes(existingNotes);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Add Post-Event Notes
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Add detailed notes or a written report for: <strong>{eventTitle}</strong>
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Event Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter detailed notes about the event, including attendance, key highlights, feedback, outcomes, or any other relevant information..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={8}
              className="resize-none"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              {notes.length}/10,000 characters
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !notes.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Notes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
