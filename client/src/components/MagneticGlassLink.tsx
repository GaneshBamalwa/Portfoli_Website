import type { ComponentPropsWithoutRef } from 'react';
import { useMagneticButton } from '@/hooks/useMagneticButton';

type MagneticGlassLinkProps = ComponentPropsWithoutRef<'a'>;

export function MagneticGlassLink({
  children,
  className,
  ...props
}: MagneticGlassLinkProps) {
  const magnetic = useMagneticButton(0.35);

  return (
    <a
      ref={magnetic.ref}
      onMouseMove={magnetic.handleMouseMove}
      onMouseLeave={magnetic.handleMouseLeave}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}
