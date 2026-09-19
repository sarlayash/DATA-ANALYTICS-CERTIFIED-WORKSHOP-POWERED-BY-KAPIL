import React, { useState } from 'react';

interface UserAvatarProps {
  src?: string | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showBorder?: boolean;
}

const sizeClasses: Record<string, string> = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base font-semibold',
  xl: 'w-20 h-20 text-2xl font-bold',
  '2xl': 'w-24 h-24 text-3xl font-extrabold',
};

// Generate consistent background color based on name
const getGradientByName = (name: string = '') => {
  const gradients = [
    'from-indigo-500 to-purple-600',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-600',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-violet-500 to-fuchsia-600'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name = 'Learner',
  size = 'md',
  className = '',
  showBorder = false
}) => {
  const [imgError, setImgError] = useState(false);

  // Upgrade Google profile photo resolution for crisp rendering
  const optimizedSrc = React.useMemo(() => {
    if (!src) return null;
    if (src.includes('googleusercontent.com')) {
      // Replace low-res =s96-c with high-res =s200-c
      return src.replace(/=s\d+(-c)?$/, '=s200-c');
    }
    return src;
  }, [src]);

  // Extract initials (e.g., "Kapil Narula" -> "KN")
  const initials = React.useMemo(() => {
    const parts = (name || 'L').trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [name]);

  const dimensionClass = sizeClasses[size] || sizeClasses.md;
  const borderClass = showBorder ? 'ring-2 ring-indigo-500/40' : '';

  if (optimizedSrc && !imgError) {
    return (
      <img
        src={optimizedSrc}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className={`${dimensionClass} rounded-full object-cover shrink-0 ${borderClass} ${className}`}
      />
    );
  }

  // Fallback: Initial-based gradient avatar
  const gradient = getGradientByName(name);
  return (
    <div
      title={name}
      className={`${dimensionClass} rounded-full bg-gradient-to-tr ${gradient} flex items-center justify-center text-white font-bold shrink-0 select-none shadow-md ${borderClass} ${className}`}
    >
      <span>{initials}</span>
    </div>
  );
};
