import React, { useState } from 'react';
import { transformAvatarUrl } from '@/lib/utils';

interface AvatarProps {
  user?: {
    firstName?: string;
    lastName?: string;
    profile?: {
      avatarUrl?: string;
    };
  };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  alt?: string;
  fallbackColor?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  user, 
  size = 'md', 
  className = '',
  alt,
  fallbackColor = 'bg-gray-400'
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-lg'
  };

  const avatarUrl = transformAvatarUrl(user?.profile?.avatarUrl);
  const displayName = alt || `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
  const initials = displayName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  // Show image if available and not errored
  const shouldShowImage = avatarUrl && !imageError;

  return (
    <div 
      className={`${sizeClasses[size]} rounded-full overflow-hidden relative flex items-center justify-center ${className}`}
    >
      {shouldShowImage ? (
        <>
          {imageLoading && (
            <div className={`${sizeClasses[size]} ${fallbackColor} animate-pulse flex items-center justify-center text-white font-medium rounded-full`}>
              {initials}
            </div>
          )}
          <img
            src={avatarUrl}
            alt={displayName}
            className={`w-full h-full object-cover ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            } transition-opacity duration-300`}
            loading="lazy"
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
            style={{ display: imageLoading ? 'none' : 'block' }}
          />
        </>
      ) : (
        // Fallback to initials
        <div className={`w-full h-full ${fallbackColor} flex items-center justify-center text-white font-medium`}>
          {initials}
        </div>
      )}
    </div>
  );
};

export default Avatar;
