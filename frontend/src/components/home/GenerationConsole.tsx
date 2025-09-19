"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Loader2,
  Download,
  RefreshCw,
  Clock,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useShowsStore } from "@/stores/showsStore";
import { generationValidator } from "@/lib/validation";
import { GenerationRequest } from "@/types";
import type { ValidationError } from "@/types/validation";

interface GenerationConsoleProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GenerationConsole({ isOpen, onClose }: GenerationConsoleProps) {
  const [formData, setFormData] = useState<GenerationRequest>({
    prompt: "",
    numImages: 5,
    model: "stable-diffusion",
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const { currentJob, createGenerationJob, updateGenerationJob } =
    useShowsStore();

  // Mock generation simulation
  const simulateGeneration = async (jobId: string, numImages: number) => {
    setIsGenerating(true);

    // Update job status to running
    updateGenerationJob(jobId, { status: "running" });

    const startTime = Date.now();
    let firstImageTime: number | undefined;

    for (let i = 0; i < numImages; i++) {
      // Random delay between 1-3 seconds per image
      const delay = Math.random() * 2000 + 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));

      const currentTime = Date.now();
      if (i === 0) {
        firstImageTime = currentTime - startTime;
      }

      // Update individual result
      updateGenerationJob(jobId, {
        results: Array.from({ length: numImages }, (_, index) => ({
          index,
          status: index <= i ? "succeeded" : "running",
          url:
            index <= i
              ? `https://picsum.photos/512/512?random=${Date.now() + index}`
              : undefined,
          startedAt: new Date(startTime + index * 100),
          finishedAt: index <= i ? new Date(currentTime) : undefined,
        })),
      });
    }

    // Mark job as completed
    const totalTime = Date.now() - startTime;
    updateGenerationJob(jobId, {
      status: "completed",
      ttfiMs: firstImageTime,
      totalMs: totalTime,
    });

    setIsGenerating(false);
  };

  const handleInputChange = (
    field: keyof GenerationRequest,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field-specific errors
    setErrors((prev) => prev.filter((error) => error.field !== field));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = generationValidator.validate(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);

    try {
      const jobId = await createGenerationJob(formData);
      simulateGeneration(jobId, formData.numImages);
    } catch (error) {
      console.error("Failed to create generation job:", error);
    }
  };

  const getFieldError = (field: string): string | undefined => {
    return errors.find((error) => error.field === field)?.message;
  };

  const isFormValid =
    generationValidator.isValid(formData) && formData.prompt.trim() !== "";

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
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
                <Sparkles className="mr-2 h-6 w-6 text-primary" />
                AI Image Generation
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Generation Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Prompt Input */}
                  <div className="lg:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-white">
                      Prompt *
                    </label>
                    <Input
                      placeholder="Describe the image you want to generate..."
                      value={formData.prompt}
                      onChange={(e) =>
                        handleInputChange("prompt", e.target.value)
                      }
                      className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 ${
                        getFieldError("prompt") ? "border-red-500" : ""
                      }`}
                      disabled={isGenerating}
                    />
                    {getFieldError("prompt") && (
                      <p className="text-sm text-red-400">
                        {getFieldError("prompt")}
                      </p>
                    )}
                  </div>

                  {/* Number of Images */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                      Batch Size
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={formData.numImages}
                      onChange={(e) =>
                        handleInputChange(
                          "numImages",
                          parseInt(e.target.value) || 1
                        )
                      }
                      className={`bg-gray-800 border-gray-700 text-white ${
                        getFieldError("numImages") ? "border-red-500" : ""
                      }`}
                      disabled={isGenerating}
                    />
                    {getFieldError("numImages") && (
                      <p className="text-sm text-red-400">
                        {getFieldError("numImages")}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-12"
                  disabled={!isFormValid || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Images...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Images
                    </>
                  )}
                </Button>
              </form>

              {/* Current Job Status */}
              {currentJob && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      Generation Progress
                    </h3>
                    {currentJob.status === "completed" &&
                      currentJob.ttfiMs &&
                      currentJob.totalMs && (
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              TTFI: {(currentJob.ttfiMs / 1000).toFixed(1)}s
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Zap className="h-4 w-4" />
                            <span>
                              Total: {(currentJob.totalMs / 1000).toFixed(1)}s
                            </span>
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Progress Bar */}
                  <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          (currentJob.results.filter(
                            (r) => r.status === "succeeded"
                          ).length /
                            currentJob.results.length) *
                          100
                        }%`,
                      }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-primary"
                    />
                  </div>

                  {/* Generated Images Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {currentJob.results.map((result) => (
                      <motion.div
                        key={result.index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="relative aspect-square rounded-lg overflow-hidden bg-gray-800"
                      >
                        {result.status === "succeeded" && result.url ? (
                          <>
                            <img
                              src={result.url}
                              alt={`Generated image ${result.index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => {
                                  // Download functionality would be implemented here
                                  const link = document.createElement("a");
                                  link.href = result.url!;
                                  link.download = `generated-image-${
                                    result.index + 1
                                  }.png`;
                                  link.click();
                                }}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </>
                        ) : result.status === "running" ? (
                          <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-gray-500 text-center">
                              <div className="w-12 h-12 bg-gray-700 rounded-lg mx-auto mb-2" />
                              <span className="text-xs">Waiting...</span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
