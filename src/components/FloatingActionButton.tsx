import { Plus } from 'lucide-react';
import { Button } from './ui/button';

interface FloatingActionButtonProps {
  onClick?: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="sm:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[#0b5fff] hover:bg-[#0949cc] text-white shadow-lg hover:shadow-xl transition-all z-40"
      size="icon"
    >
      <Plus className="w-6 h-6" />
    </Button>
  );
}
