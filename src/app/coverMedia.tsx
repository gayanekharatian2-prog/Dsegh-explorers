import { type RefObject, type VideoHTMLAttributes } from 'react';

const VIDEO_EXT = /\.(mp4|webm|m4v|mov)(\?|#|$)/i;

export function isCoverVideo(path: string) {
  return VIDEO_EXT.test(path);
}

type CoverMediaBoxProps = {
  src: string;
  className: string;
  'aria-hidden'?: boolean;
  videoRef?: RefObject<HTMLVideoElement | null>;
} & Pick<VideoHTMLAttributes<HTMLVideoElement>, 'autoPlay' | 'loop' | 'muted' | 'playsInline' | 'preload' | 'controls'>;

/**
 * Renders a public or remote still, or a video (must be silent for autoplay in the hero/thumbs).
 */
export function CoverMediaBox({
  src,
  className,
  'aria-hidden': ariaHidden,
  videoRef,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  preload = 'auto',
  controls = false,
}: CoverMediaBoxProps) {
  if (isCoverVideo(src)) {
    return (
      <video
        ref={videoRef}
        key={src}
        src={src}
        className={className}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        preload={preload}
        controls={controls}
        aria-hidden={ariaHidden}
      />
    );
  }
  return <img key={src} src={src} alt="" className={className} loading="lazy" aria-hidden={ariaHidden} />;
}
