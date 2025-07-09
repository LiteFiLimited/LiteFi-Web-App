import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  confirmText?: string;
  cancelText?: string;
}

/**
 * Reusable Confirmation Modal for profile updates
 * 
 * Usage examples:
 * - title="Confirm Profile Changes"
 * - title="Confirm Employment Information"
 * - title="Confirm Next of Kin Details"
 * - title="Confirm Bank Account Details"
 * - title="Confirm Business Information"
 */
export default function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title = "Confirm Changes",
  confirmText = "Confirm",
  cancelText = "Cancel"
}: ConfirmationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-auto bg-white rounded-lg shadow-xl border border-gray-200 p-6">
        <DialogHeader className="text-center space-y-3">
          {/* Warning Icon */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          
          {/* Title */}
          <DialogTitle className="text-lg font-semibold text-gray-900 text-center">
            {title}
          </DialogTitle>
          
          {/* Dynamic Message based on title */}
          <DialogDescription className="text-gray-600 text-sm leading-relaxed">
            Important Notice: Once you save these changes, the filled fields will be locked and cannot be edited again. Please review your information carefully before proceeding.
          </DialogDescription>
        </DialogHeader>
        
        {/* Action Buttons - made wider */}
        <div className="flex justify-center gap-3 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 h-10 text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white border-red-600"
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 