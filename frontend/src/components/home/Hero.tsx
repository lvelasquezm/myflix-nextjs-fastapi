'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Play as PlayIcon,
  Plus as PlusIcon,
  Info as InfoIcon,
  Star as StarIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useShowsStore } from '@/stores/showsStore';

export default function Hero() {
  const { addToMyList, removeFromMyList, getFeaturedShow } = useShowsStore();

  const featuredShow = getFeaturedShow();
  if (!featuredShow) {
    return (
      <div className="relative h-screen bg-gradient-to-r from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading your content...</div>
      </div>
    );
  }

  const handleMyListToggle = () => {
    if (featuredShow.isInMyList) {
      removeFromMyList(featuredShow.id);
    } else {
      addToMyList(featuredShow);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={featuredShow.imageUrl}
          alt={featuredShow.title}
          fill
          priority
          className="object-cover w-full h-full"
          sizes="100vw"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="px-4 md:px-12">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {featuredShow.title}
              </h1>

              {/* Show metadata */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center gap-x-1 bg-primary px-2 py-1 rounded">
                  <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-sm font-semibold">{featuredShow.rating}</span>
                </div>
                <span className="text-gray-300">{featuredShow.year}</span>
                <span className="text-gray-300">{featuredShow.duration}</span>
                <div className="flex space-x-1">
                  {featuredShow.genre.map((g, i) => (
                    <span key={i} className="text-gray-300">
                      {g}{i < featuredShow.genre.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                {featuredShow.description}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-x-4 gap-y-2 sm:flex-row flex-col">
                <Button size="lg" className="flex gap-x-2 w-full sm:w-auto">
                  <PlayIcon className="h-5 w-5 fill-current" />
                  Play
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="flex gap-x-2 w-full sm:w-auto"
                  onClick={handleMyListToggle}
                >
                  <PlusIcon className="h-5 w-5" />
                  {featuredShow.isInMyList ? 'Remove from' : 'Add to'} My List
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="flex gap-x-2 w-full sm:w-auto"
                >
                  <InfoIcon className="h-5 w-5" />
                  More Info
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Fade to content */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}
