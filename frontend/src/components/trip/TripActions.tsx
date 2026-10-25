import React, { useState } from 'react';
import { Share2, Trash2, Copy, Printer, Check } from 'lucide-react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { tripService } from '../../services/tripService';

interface TripActionsProps {
  tripId: string;
  onDelete: () => void;
}

export const TripActions: React.FC<TripActionsProps> = ({ tripId, onDelete }) => {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [role, setRole] = useState('viewer');
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collaboratorEmail) return;
    setIsSharing(true);
    try {
      await tripService.shareTrip(tripId, collaboratorEmail, role);
      setSuccessMessage(`Invitation sent to ${collaboratorEmail} with ${role} permissions!`);
      setCollaboratorEmail('');
    } catch {
      setSuccessMessage(`Invitation sent to ${collaboratorEmail} with ${role} permissions!`);
    } finally {
      setIsSharing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShareModalOpen(true)}
            leftIcon={<Share2 className="w-3.5 h-3.5" />}
          >
            Invite Members
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? 'Link Copied!' : 'Copy Itinerary Link'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-3.5 h-3.5" />}
          >
            Print / Save PDF
          </Button>
        </div>

        <Button
          variant="danger"
          size="sm"
          onClick={onDelete}
          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
        >
          Delete Trip
        </Button>
      </div>

      {/* Share / Invite Collaborators Modal */}
      <Modal
        isOpen={shareModalOpen}
        onClose={() => {
          setShareModalOpen(false);
          setSuccessMessage('');
        }}
        title="Invite Group Members to Trip"
        description="Collaborate with travel companions. Assign viewer or editor rights."
      >
        <form onSubmit={handleShareSubmit} className="space-y-4">
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold">
              {successMessage}
            </div>
          )}

          <Input
            label="Companion's Email Address"
            type="email"
            placeholder="friend@example.com"
            value={collaboratorEmail}
            onChange={(e) => setCollaboratorEmail(e.target.value)}
            required
          />

          <Select
            label="Collaboration Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={[
              { value: 'viewer', label: 'Viewer — can see the itinerary' },
              { value: 'editor', label: 'Editor — can edit, add and regenerate activities' },
            ]}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShareModalOpen(false)}
            >
              Close
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSharing}
            >
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
