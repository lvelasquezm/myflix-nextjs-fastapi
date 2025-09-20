'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X as XIcon,
  Sparkles as SparklesIcon,
  Loader2 as Loader2Icon,
  Download as DownloadIcon,
  RefreshCw as RefreshCwIcon,
  Clock as ClockIcon,
  Zap as ZapIcon,
  AlertCircle as AlertCircleIcon,
} from 'lucide-react';

import InputErrorMsg from '@/components/auth/InputErrorMsg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { cn } from '@/lib/utils';
import { generationValidator } from '@/lib/validation';
import { useGenerationStore } from '@/stores/generationStore';
import type { GenerationRequest } from '@/types/generation';
import type { ValidationError } from '@/types/validation';

interface GenerationConsoleProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GenerationConsole({ isOpen, onClose }: GenerationConsoleProps) {
  const [formData, setFormData] = useState<GenerationRequest>({
    prompt: '',
    numImages: 5,
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const {
    currentJob,
    isLoading,
    error,
    isGenerating,
    createJob,
    clearError,
    clearJob,
    unsubscribeFromJob,
  } = useGenerationStore();

  // Clean up on unmount or close
  useEffect(() => {
    return () => {
      unsubscribeFromJob();
    };
  }, [unsubscribeFromJob]);

  // Handle close
  const handleClose = () => {
    if (!isGenerating) {
      clearJob();
    }

    setFormData({
      prompt: '',
      numImages: 5,
    });
    setErrors([]);
    onClose();
  };

  const handleInputChange = (
    field: keyof GenerationRequest,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field-specific errors as user types.
    setErrors((prev) => prev.filter((error) => error.field !== field));

    if (error) {
      clearError();
    }
  };

  const promptError = useMemo(() => {
    return errors.find((error) => error.field === 'prompt')?.message;
  }, [errors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form.
    const errors = generationValidator.validate(formData);
    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    setErrors([]);

    try {
      await createJob(formData);
    } catch (error) {
      console.error('Failed to create generation job:', error);
    }
  };

  const handleRetry = () => {
    if (currentJob) {
      const request: GenerationRequest = {
        prompt: currentJob.prompt,
        numImages: currentJob.numImages,
      };
      createJob(request);
    }
  };

  const handleNewGeneration = () => {
    clearJob();
  };

  const downloadImage = (url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `generated-image-${index + 1}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCompletedCount = () => {
    if (!currentJob) return 0;
    return currentJob.results.filter((r) => r.status === 'succeeded').length;
  };

  const getProgressPercentage = () => {
    if (!currentJob) return 0;
    return (getCompletedCount() / currentJob.numImages) * 100;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-bold text-white flex items-center">
                <SparklesIcon className="mr-2 h-6 w-6 text-primary" />
                AI Image Generation
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                disabled={isGenerating}
              >
                <XIcon className="h-5 w-5" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Error display */}
              {error && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircleIcon className="h-5 w-5 text-red-400" />
                    <span className="text-red-400 font-medium">Error</span>
                  </div>
                  <p className="text-red-300 mt-1">{error}</p>
                  {currentJob && (
                    <Button
                      onClick={handleRetry}
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      disabled={isLoading || isGenerating}
                    >
                      <RefreshCwIcon className="h-4 w-4 mr-2" />
                      Retry
                    </Button>
                  )}
                </div>
              )}

              {/* Generation form */}
              {!currentJob && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Prompt input */}
                    <div className="lg:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-white">
                        Prompt *
                      </label>
                      <Input
                        name="prompt"
                        placeholder="Describe the image you want to generate..."
                        value={formData.prompt}
                        onChange={(e) =>
                          handleInputChange('prompt', e.target.value)
                        }
                        className={cn(
                          'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-primary focus-visible:ring-0',
                          promptError && 'border-red-500'
                        )}
                        disabled={isLoading || isGenerating}
                      />
                      <AnimatePresence>
                        <InputErrorMsg key={promptError} error={promptError} />
                      </AnimatePresence>
                    </div>

                    {/* Number of images */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">
                        Images to generate (1+)
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={formData.numImages}
                        onChange={(e) =>
                          handleInputChange(
                            'numImages',
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-primary focus-visible:ring-0"
                        disabled={isLoading || isGenerating}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-12"
                    disabled={isLoading || isGenerating}
                  >
                    {isLoading ? (
                      <>
                        <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                        Creating Job...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="mr-2 h-5 w-5" />
                        Generate Images
                      </>
                    )}
                  </Button>
                </form>
              )}

              {/* Job status */}
              {currentJob && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Generation Progress
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        &ldquo;{currentJob.prompt}&rdquo;
                      </p>
                    </div>
                    {currentJob.status === 'completed' &&
                      currentJob.ttfiMs &&
                      currentJob.totalMs && (
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="h-4 w-4" />
                            <span>
                              TTFI: {(currentJob.ttfiMs / 1000).toFixed(1)}s
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ZapIcon className="h-4 w-4" />
                            <span>
                              Total: {(currentJob.totalMs / 1000).toFixed(1)}s
                            </span>
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Progress bar */}
                  <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${getProgressPercentage()}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-primary"
                    />
                  </div>

                  {/* Progress stats */}
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>
                      {getCompletedCount()} of {currentJob.numImages} completed
                    </span>
                    <span>{Math.round(getProgressPercentage())}%</span>
                  </div>

                  {/* Generated images grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {currentJob.results.map((result) => (
                      <motion.div
                        key={result.index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: result.index * 0.1,
                        }}
                        className="relative aspect-square rounded-lg overflow-hidden bg-gray-800 border border-gray-700"
                      >
                        {result.status === 'succeeded' && result.url ? (
                          <>
                            <Image
                              src={result.url}
                              alt={`Generated image ${result.index + 1}`}
                              className="w-full h-full object-cover"
                              width={200}
                              height={200}
                              loading="lazy"
                            />
                            <div className="absolute top-2 right-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-8 w-8 p-0"
                                onClick={() =>
                                  downloadImage(result.url!, result.index)
                                }
                              >
                                <DownloadIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </>
                        ) : result.status === 'pending' ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <Loader2Icon className="h-8 w-8 text-primary animate-spin mx-auto mb-2" />
                              <span className="text-xs text-gray-400">
                                Generating...
                              </span>
                            </div>
                          </div>
                        ) : result.status === 'failed' ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <AlertCircleIcon className="h-8 w-8 text-red-400 mx-auto mb-2" />
                              <span className="text-xs text-red-400">
                                Failed
                              </span>
                              {result.error && (
                                <p className="text-xs text-gray-500 mt-1 px-2">
                                  {result.error}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <Loader2Icon className="h-8 w-8 text-primary animate-spin mx-auto mb-2" />
                              <span className="text-xs text-gray-500">
                                Processing...
                              </span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  {currentJob.status === 'completed' && (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleNewGeneration}
                        variant="outline"
                        className="flex-1"
                      >
                        <SparklesIcon className="h-4 w-4 mr-2" />
                        New Generation
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
