'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import ScrollButton from '@/components/home/Shows/ScrollButton';
import ShowCard from '@/components/home/Shows/ShowCard';
import type { ShowRow as ShowRowType } from '@/types/shows';

// Scroll amount as a percentage of container width.
const SCROLL_AMOUNT = 0.8;

interface ShowRowProps {
  showRow: ShowRowType;
  index: number;
}

export default function ShowRow({ showRow, index }: ShowRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  const checkScrollButtons = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    // Scroll 80% of container width.
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * SCROLL_AMOUNT;
    
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScrollButtons();
    container.addEventListener('scroll', checkScrollButtons);
    window.addEventListener('resize', checkScrollButtons);

    return () => {
      container.removeEventListener('scroll', checkScrollButtons);
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative mb-12"
    >
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-bold mb-4 px-4 md:px-12">
        {showRow.title}
      </h2>

      {/* Scrollable content */}
      <div className="relative">
        {/* Left scroll button */}
        {canScrollLeft && (
          <ScrollButton
            direction="left"
            onClick={() => handleScroll('left')}
          />
        )}

        {/* Right scroll button */}
        {canScrollRight && (
          <ScrollButton
            direction="right"
            onClick={() => handleScroll('right')}
          />
        )}

        {/* Shows Container */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide px-4 md:px-12 pb-4"
        >
          {showRow.shows.map((show, i) => (
            <div key={show.id} className="flex-none w-64 md:w-80">
              <ShowCard show={show} index={i} />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
