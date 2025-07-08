import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { X } from 'lucide-react';
import { validateFileUpload } from '@/lib/api';

interface FileWithPreview extends File {
  preview?: string;
}

interface ProfilePictureUploadProps {
  currentAvatarUrl?: string;
  onUploadSuccess?: () => void;
  onUpload: (file: File) => Promise<string>;
  isUploading?: boolean;
  className?: string;
}

// Skeleton loader component
const ProfileImageSkeleton = () => (
  <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse mb-4" />
);

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentAvatarUrl,
  onUploadSuccess,
  onUpload,
  isUploading = false,
  className = ""
}) => {
  const [profileImage, setProfileImage] = useState<FileWithPreview | undefined>(undefined);
  const [showUploadInterface, setShowUploadInterface] = useState(!currentAvatarUrl);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Validate file using the utility function
      const validation = validateFileUpload(file, {
        maxSizeInMB: 5,
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png']
      });
      
      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file)
      });
      setProfileImage(fileWithPreview);
    }
  }, []);

  // Setup dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  // Handle upload
  const handleUpload = async () => {
    if (!profileImage) return;

    try {
      await onUpload(profileImage);
      // Clear preview after successful upload
      removeProfileImage();
      setShowUploadInterface(false);
      onUploadSuccess?.();
    } catch (error) {
      console.error('Upload failed:', error);
      // Error handling is done in the parent component
    }
  };

  // Remove profile image
  const removeProfileImage = () => {
    if (profileImage?.preview) {
      URL.revokeObjectURL(profileImage.preview);
    }
    setProfileImage(undefined);
  };

  // Clean up preview URLs on unmount
  React.useEffect(() => {
    return () => {
      if (profileImage?.preview) {
        URL.revokeObjectURL(profileImage.preview);
      }
    };
  }, [profileImage]);

  // Reset image states when currentAvatarUrl changes
  React.useEffect(() => {
    if (currentAvatarUrl) {
      setImageLoading(true);
      setImageError(false);
      setShowUploadInterface(false);
    } else {
      setShowUploadInterface(true);
    }
  }, [currentAvatarUrl]);

  return (
    <div className={`bg-gray-50 p-5 rounded-sm ${className}`}>
      <div className="flex flex-col items-center">
        {/* Show existing avatar if available and not in upload mode */}
        {currentAvatarUrl && !showUploadInterface ? (
          <div className="relative w-32 h-32 mb-4">
            {imageLoading && <ProfileImageSkeleton />}
            <img 
              src={currentAvatarUrl} 
              alt="Profile Picture" 
              className={`w-full h-full object-cover rounded-full border-4 border-white shadow-lg ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              } transition-opacity duration-300`}
              loading="lazy"
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false);
                setImageError(true);
                // Fallback to show upload interface if image fails to load
                setShowUploadInterface(true);
              }}
              style={{ display: imageLoading ? 'none' : 'block' }}
            />
            {!imageLoading && !imageError && (
              <button 
                onClick={() => setShowUploadInterface(true)}
                className="absolute bottom-0 right-0 bg-red hover:bg-red/90 text-white rounded-full p-2 shadow-lg transition-colors"
                title="Change profile picture"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}
          </div>
        ) : (
          /* Upload interface */
          <>
            {profileImage ? (
              <div className="relative w-full max-w-xs mb-4 overflow-hidden">
                <img 
                  src={profileImage.preview} 
                  alt="Profile Preview" 
                  className="w-full h-auto rounded-lg"
                />
                <button 
                  onClick={removeProfileImage}
                  disabled={isUploading}
                  className="absolute top-2 right-2 bg-red-50 hover:bg-red-100 text-red rounded-full p-1 disabled:opacity-50"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div 
                {...getRootProps()} 
                className={`w-full max-w-md border-2 border-dashed border-gray-300 flex items-center justify-center bg-white mb-4 cursor-pointer hover:border-gray-400 transition-colors p-8 ${
                  isDragActive ? "bg-gray-50 border-gray-400" : ""
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                  <Image 
                    src="/assets/svgs/uplod-photo.svg"
                    alt="Upload photo"
                    width={80}
                    height={80}
                  />
                  <p className={`text-sm text-center ${isDragActive ? "font-medium text-gray-700" : "text-gray-500"}`}>
                    {isDragActive ? "Drop image here" : "Click or drag image here to upload"}
                  </p>
                </div>
              </div>
            )}

            {/* Upload/Cancel buttons */}
            <div className="flex gap-2 mb-4">
              {profileImage && (
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="px-4 py-2 bg-red text-white hover:bg-red/90 disabled:opacity-50 flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : (
                    'Upload Picture'
                  )}
                </button>
              )}
              
              {(currentAvatarUrl || profileImage) && (
                <button
                  onClick={() => {
                    setShowUploadInterface(false);
                    removeProfileImage();
                    setImageError(false);
                    setImageLoading(true);
                  }}
                  disabled={isUploading}
                  className="px-4 py-2 bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </>
        )}
        
        <p className="text-gray-500 text-xs max-w-xs text-center">
          Note: Please take a new picture or upload a picture which is not more than a month old
        </p>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
