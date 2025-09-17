import { motion } from 'framer-motion';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ScrollButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
}

export default function ScrollButton({ direction, onClick }: ScrollButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClick}
      className={cn(
        'cursor-pointer absolute top-1/2 -translate-y-1/2 z-20 bg-white/60 hover:bg-white text-gray-900 p-2 rounded-full opacity-0 transition-all duration-300',
        direction === 'left' ? 'left-2' : 'right-2'
      )}
    >
      {direction === 'left' ? <ChevronLeftIcon className="h-6 w-6" /> : <ChevronRightIcon className="h-6 w-6" />}
    </motion.button>
  );
}
