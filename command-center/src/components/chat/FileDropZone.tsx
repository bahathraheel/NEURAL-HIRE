'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/stores/chatStore';

export function FileDropZone() {
  const { pendingAttachments, addAttachment, removeAttachment } = useChatStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const isImage = file.type.startsWith('image/');
      addAttachment({
        id: `att-${Date.now()}-${Math.random()}`,
        name: file.name,
        type: isImage ? 'image' : 'document',
        url: isImage ? URL.createObjectURL(file) : '',
        size: file.size,
      });
    });
  }, [addAttachment]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
  });

  return (
    <div className="w-full flex flex-col gap-2 p-2">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ease-in-out',
          isDragActive
            ? 'border-trust-blue bg-trust-blue-pale/50 scale-[1.02]'
            : 'border-border hover:border-trust-blue-light hover:bg-background-muted'
        )}
      >
        <input {...getInputProps()} />
        <UploadCloud size={24} className={cn('mb-2', isDragActive ? 'text-trust-blue' : 'text-foreground-muted')} />
        <p className="text-sm font-medium text-foreground-secondary text-center">
          {isDragActive ? 'Drop files now...' : 'Drop images or documents here, or click to browse'}
        </p>
      </div>

      {/* Previews */}
      <AnimatePresence>
        {pendingAttachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2 overflow-x-auto pb-1"
          >
            {pendingAttachments.map((file) => (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group w-20 h-20 shrink-0 rounded-lg border border-border overflow-hidden bg-background-muted flex flex-col items-center justify-center"
              >
                {file.type === 'image' && file.url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <FileText size={24} className="text-trust-blue mb-1" />
                    <span className="text-[10px] text-foreground-secondary truncate w-full px-1 text-center">
                      {file.name}
                    </span>
                  </>
                )}
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAttachment(file.id);
                  }}
                  className="absolute top-1 right-1 p-0.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                >
                  <X size={12} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
