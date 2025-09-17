'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play as PlayIcon,
  Plus as PlusIcon,
  Star as StarIcon,
  Check as CheckIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Show } from '@/types/shows';
import { useShowsStore } from '@/stores/showsStore';

interface ShowCardProps {
  show: Show;
  index: number;
}

export default function ShowCard({ show, index }: ShowCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const { addToMyList, removeFromMyList } = useShowsStore();

  const handleMyListToggle = () => {
    if (show.isInMyList) {
      removeFromMyList(show.id);
    } else {
      addToMyList(show);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
        {/* Image */}
        <Image
          src={show.imageUrl}
          alt={show.title}
          fill
          className={cn(
            'transition-all duration-300',
            isHovered ? 'scale-110' : 'scale-100',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setIsLoaded(true)}
        />
        
        {/* Loading skeleton */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-600 animate-pulse" />
        )}

        {/* Rating badge */}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md">
          <div className="flex items-center space-x-1">
            <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-xs text-white font-medium">{show.rating}</span>
          </div>
        </div>
      </div>

      {/* Info card */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.2 }}
            className="absolute top-0 left-0 right-0 z-10 bg-gray-900 rounded-lg shadow-2xl p-3 border border-gray-700"
          >
            {/* Title and metadata */}
            <div className="mb-3">
              <h3 className="text-white font-semibold text-sm mb-1">{show.title}</h3>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <span>{show.year}</span>
                <span>•</span>
                <span>{show.duration}</span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                  <span>{show.rating}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-xs mb-3 line-clamp-2">
              {show.description}
            </p>

            {/* Genres */}
            <div className="hidden md:flex flex-wrap gap-1 mb-3">
              {show.genre.map((genre, idx) => (
                <span
                  key={idx}
                  className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button size="sm" className="h-8 px-3">
                  <PlayIcon className="h-3 w-3 mr-1 fill-current" />
                  Play
                </Button>
                
                <div className="relative group">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleMyListToggle}
                    className="w-8 h-8 p-0"
                  >
                    {show.isInMyList ? (
                      <CheckIcon className="h-3 w-3" /> 
                    ) : (
                      <PlusIcon className="h-3 w-3" />
                    )} 
                  </Button>
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity bg-gray-800 border border-gray-700 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-20">
                    {show.isInMyList ? 'Remove from My List' : 'Add to My List'}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
