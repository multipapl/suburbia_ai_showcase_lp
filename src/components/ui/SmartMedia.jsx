import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useScenario } from '../../context/ScenarioContext';

/**
 * SmartGallery Component with Lightbox
 * 
 * Features:
 * - Supports single mediaUrl (string) OR mediaUrls (array)
 * - Auto-playing slideshow with configurable interval
 * - Framer Motion cross-fade transitions
 * - Full-screen Lightbox with navigation
 * - Keyboard support (ESC, Arrow keys)
 * - Body scroll lock when lightbox open
 */

// Detect media type from URL
function getMediaType(url) {
    if (!url) return 'placeholder';
    const lower = url.toLowerCase();
    if (lower.includes('.mp4') || lower.includes('.webm') || lower.includes('.mov')) return 'video';
    if (lower.includes('.gif')) return 'gif';
    if (lower.includes('.jpg') || lower.includes('.jpeg') || lower.includes('.png') || lower.includes('.webp')) return 'image';
    return 'image';
}

// Generate Cloudinary optimized URL for images
function getOptimizedUrl(url, options = {}) {
    if (!url) return null;
    const { width = 1200, quality = 'auto', format = 'auto' } = options;

    if (url.includes('cloudinary.com')) {
        return url.replace('/upload/', `/upload/q_${quality},f_${format},w_${width}/`);
    }
    if (url.includes('imgix.net')) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}auto=format,compress&w=${width}&q=75`;
    }
    return url;
}

// Generate Cloudinary optimized URL for videos
// Uses f_auto (WebM for supported browsers), q_auto, vc_auto (codec optimization)
function getOptimizedVideoUrl(url, options = {}) {
    if (!url) return null;
    const { quality = 'auto', width } = options;

    if (url.includes('cloudinary.com')) {
        // Video transformations: f_auto (WebM when supported), q_auto, vc_auto (auto codec)
        const transforms = [`f_auto`, `q_${quality}`, `vc_auto`];
        if (width) transforms.push(`w_${width}`);
        return url.replace('/upload/', `/upload/${transforms.join(',')}/`);
    }
    return url;
}

// Generate low-res placeholder URL
function getPlaceholderUrl(url) {
    if (!url) return null;
    if (url.includes('cloudinary.com')) {
        return url.replace('/upload/', '/upload/q_10,f_auto,w_50,e_blur:500/');
    }
    if (url.includes('imgix.net')) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}w=50&blur=100&q=10`;
    }
    return null;
}

// Get dominant color based on scenario
function getDominantColor(isPrecision) {
    return isPrecision ? 'rgba(0, 209, 255, 0.2)' : 'rgba(255, 138, 0, 0.2)';
}

// Normalize src prop to always be an array
function normalizeMedia(src, srcs) {
    if (srcs && Array.isArray(srcs) && srcs.length > 0) {
        return srcs;
    }
    if (src) {
        return [src];
    }
    return [];
}

// Lightbox Component
function Lightbox({
    isOpen,
    onClose,
    mediaUrls,
    currentIndex,
    setCurrentIndex,
    isPrecision,
    title
}) {
    const isGallery = mediaUrls.length > 1;

    // Navigate functions
    const goNext = useCallback(() => {
        setCurrentIndex(prev => (prev + 1) % mediaUrls.length);
    }, [mediaUrls.length, setCurrentIndex]);

    const goPrev = useCallback(() => {
        setCurrentIndex(prev => (prev - 1 + mediaUrls.length) % mediaUrls.length);
    }, [mediaUrls.length, setCurrentIndex]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight' && isGallery) goNext();
            if (e.key === 'ArrowLeft' && isGallery) goPrev();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, goNext, goPrev, isGallery]);

    // Lock body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const currentUrl = mediaUrls[currentIndex];
    const mediaType = getMediaType(currentUrl);
    // Use video-specific optimization for videos, image optimization for images
    const fullResUrl = mediaType === 'video'
        ? getOptimizedVideoUrl(currentUrl)
        : getOptimizedUrl(currentUrl, { width: 1920 });

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                    onClick={onClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-deep-black/95 backdrop-blur-xl" />

                    {/* Close button */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        onClick={onClose}
                        className={`absolute top-6 right-6 z-10 w-12 h-12 rounded-full border flex items-center justify-center backdrop-blur-sm transition-all ${isPrecision
                            ? 'bg-cyber-blue/20 border-cyber-blue/50 hover:bg-cyber-blue/40'
                            : 'bg-safety-orange/20 border-safety-orange/50 hover:bg-safety-orange/40'
                            }`}
                    >
                        <X className="w-6 h-6 text-white" />
                    </motion.button>

                    {/* Navigation arrows */}
                    {isGallery && (
                        <>
                            <motion.button
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 }}
                                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                                className={`absolute left-6 z-10 w-12 h-12 rounded-full border flex items-center justify-center backdrop-blur-sm transition-all ${isPrecision
                                    ? 'bg-cyber-blue/20 border-cyber-blue/50 hover:bg-cyber-blue/40'
                                    : 'bg-safety-orange/20 border-safety-orange/50 hover:bg-safety-orange/40'
                                    }`}
                            >
                                <ChevronLeft className="w-6 h-6 text-white" />
                            </motion.button>
                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 }}
                                onClick={(e) => { e.stopPropagation(); goNext(); }}
                                className={`absolute right-6 z-10 w-12 h-12 rounded-full border flex items-center justify-center backdrop-blur-sm transition-all ${isPrecision
                                    ? 'bg-cyber-blue/20 border-cyber-blue/50 hover:bg-cyber-blue/40'
                                    : 'bg-safety-orange/20 border-safety-orange/50 hover:bg-safety-orange/40'
                                    }`}
                            >
                                <ChevronRight className="w-6 h-6 text-white" />
                            </motion.button>
                        </>
                    )}

                    {/* Counter */}
                    {isGallery && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-deep-black/60 backdrop-blur-sm text-sm text-text-muted"
                        >
                            {currentIndex + 1} / {mediaUrls.length}
                        </motion.div>
                    )}

                    {/* Title */}
                    {title && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-deep-black/60 backdrop-blur-sm text-sm text-text-primary"
                        >
                            {title}
                        </motion.div>
                    )}

                    {/* Media content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="relative max-w-[90vw] max-h-[85vh] z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                            >
                                {mediaType === 'video' ? (
                                    <video
                                        src={fullResUrl}
                                        controls
                                        autoPlay
                                        loop
                                        playsInline
                                        className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-2xl"
                                    />
                                ) : (
                                    <img
                                        src={fullResUrl}
                                        alt={title || 'Gallery image'}
                                        className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
                                        draggable={false}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>

                    {/* Navigation dots */}
                    {isGallery && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2"
                        >
                            {mediaUrls.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                        ? isPrecision ? 'bg-cyber-blue w-6' : 'bg-safety-orange w-6'
                                        : 'bg-white/40 hover:bg-white/60'
                                        }`}
                                />
                            ))}
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}

export default function SmartMedia({
    src,
    srcs,
    poster,
    alt = '',
    stageId,
    title,
    aspectRatio = 'video',
    showPlayButton = false,
    isAnimated = false,
    autoPlayInterval = 4000,
    pauseOnHover = true,
    enableLightbox = true  // New prop to enable/disable lightbox
}) {
    const { scenario } = useScenario();
    const isPrecision = scenario === 'A';

    // Normalize to array
    const mediaUrls = normalizeMedia(src, srcs);
    const isGallery = mediaUrls.length > 1;

    // State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState({});
    const [isInView, setIsInView] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [hasError, setHasError] = useState({});
    const [lightboxOpen, setLightboxOpen] = useState(false);

    // Refs
    const containerRef = useRef(null);
    const videoRef = useRef(null);
    const autoPlayRef = useRef(null);

    // Current media
    const currentUrl = mediaUrls[currentIndex] || null;
    const mediaType = getMediaType(currentUrl);
    // Use video-specific optimization for videos (f_auto, q_auto, vc_auto for WebM)
    const optimizedUrl = mediaType === 'video'
        ? getOptimizedVideoUrl(currentUrl)
        : getOptimizedUrl(currentUrl);
    const placeholderUrl = getPlaceholderUrl(currentUrl);
    const dominantColor = getDominantColor(isPrecision);
    const videoPosterUrl = poster ? getOptimizedUrl(poster, { width: 800 }) : placeholderUrl;

    // Aspect ratio classes
    const aspectClasses = {
        video: 'aspect-video',
        square: 'aspect-square',
        portrait: 'aspect-[3/4]'
    };

    // Navigation functions
    const goToSlide = useCallback((index) => {
        setCurrentIndex(index);
    }, []);

    const nextSlide = useCallback(() => {
        setCurrentIndex(prev => (prev + 1) % mediaUrls.length);
    }, [mediaUrls.length]);

    // Handle click to open lightbox
    const handleClick = () => {
        if (enableLightbox && mediaUrls.length > 0 && !hasError[currentUrl]) {
            setLightboxOpen(true);
        }
    };

    // IntersectionObserver for lazy loading
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px', threshold: 0.01 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
        return () => observer.disconnect();
    }, []);

    // Auto-play slideshow (only for images, videos handle their own advancement)
    useEffect(() => {
        if (!isGallery || !isInView || autoPlayInterval <= 0 || lightboxOpen) return;
        if (pauseOnHover && isHovered) return;
        // Skip auto-advance for videos - they advance on 'ended' event
        if (mediaType === 'video') return;

        autoPlayRef.current = setInterval(nextSlide, autoPlayInterval);

        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
        };
    }, [isGallery, isInView, autoPlayInterval, pauseOnHover, isHovered, nextSlide, lightboxOpen, mediaType]);

    // Auto-play video when in view or after slide change
    useEffect(() => {
        if (mediaType === 'video' && isInView && !lightboxOpen) {
            // Use MutationObserver to detect when video element is mounted and try playing
            const attemptPlay = () => {
                if (videoRef.current) {
                    videoRef.current.play().catch(() => { });
                }
            };

            // Multiple attempts with increasing delays to ensure video plays
            const timer1 = setTimeout(attemptPlay, 50);
            const timer2 = setTimeout(attemptPlay, 200);
            const timer3 = setTimeout(attemptPlay, 500);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
            };
        }
    }, [isInView, mediaType, currentIndex, lightboxOpen]);

    // Handle image load
    const handleLoad = (url) => {
        setLoadedImages(prev => ({ ...prev, [url]: true }));
    };

    // Handle error
    const handleError = (url) => {
        setHasError(prev => ({ ...prev, [url]: true }));
    };

    // Handle video ended - advance to next slide in gallery
    const handleVideoEnded = () => {
        if (isGallery) {
            nextSlide();
        }
    };

    // Check if current image is loaded
    const isCurrentLoaded = loadedImages[currentUrl];
    const hasCurrentError = hasError[currentUrl];

    // Render placeholder/fallback when no media
    if (mediaUrls.length === 0 || (mediaUrls.length === 1 && hasCurrentError)) {
        return (
            <motion.div
                ref={containerRef}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className={`relative ${aspectClasses[aspectRatio]} rounded-2xl overflow-hidden border border-white/10 ${isPrecision
                    ? 'bg-gradient-to-br from-cyber-blue/20 via-surface to-surface-light'
                    : 'bg-gradient-to-br from-safety-orange/20 via-surface to-surface-light'
                    }`}
            >
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
                        backgroundSize: '30px 30px'
                    }}
                />
                <div className="absolute inset-0 animate-shimmer" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${isPrecision ? 'bg-cyber-blue/20' : 'bg-safety-orange/20'}`}>
                        <ImageIcon className={`w-8 h-8 ${isPrecision ? 'text-cyber-blue/60' : 'text-safety-orange/60'}`} />
                    </div>
                    <div className="text-center">
                        <p className="text-text-dim text-sm">Stage {stageId}</p>
                        <p className="text-text-muted text-base font-medium">{title}</p>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <>
            <motion.div
                ref={containerRef}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                onClick={handleClick}
                className={`relative ${aspectClasses[aspectRatio]} rounded-2xl overflow-hidden border border-white/10 group ${enableLightbox ? 'cursor-zoom-in' : ''
                    } ${isAnimated ? 'ring-2 ring-offset-2 ring-offset-deep-black ' + (isPrecision ? 'ring-cyber-blue/30' : 'ring-safety-orange/30') : ''}`}
                style={{ backgroundColor: dominantColor }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Cross-fade slides container */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        className="absolute inset-0"
                    >
                        {/* Blur-up placeholder */}
                        {placeholderUrl && !isCurrentLoaded && (
                            <img
                                src={placeholderUrl}
                                alt=""
                                className="absolute inset-0 w-full h-full object-contain blur-lg scale-105"
                                aria-hidden="true"
                            />
                        )}

                        {/* Loading shimmer */}
                        {!placeholderUrl && !isCurrentLoaded && (
                            <>
                                <div
                                    className="absolute inset-0 opacity-30"
                                    style={{
                                        backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
                                        backgroundSize: '30px 30px'
                                    }}
                                />
                                <div className="absolute inset-0 animate-shimmer" />
                            </>
                        )}

                        {/* Video */}
                        {isInView && mediaType === 'video' && (
                            <video
                                ref={videoRef}
                                src={optimizedUrl}
                                muted
                                autoPlay
                                loop={!isGallery}  // Only loop if single video (not gallery)
                                playsInline
                                preload="auto"
                                onLoadedData={() => handleLoad(currentUrl)}
                                onCanPlay={(e) => {
                                    // Ensure video plays when ready
                                    if (!lightboxOpen) {
                                        e.target.play().catch(() => { });
                                    }
                                }}
                                onError={() => handleError(currentUrl)}
                                onEnded={handleVideoEnded}  // Advance to next slide when video ends
                                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ease-out ${isCurrentLoaded ? 'opacity-100' : 'opacity-0'}`}
                                poster={videoPosterUrl || undefined}
                            />
                        )}

                        {/* Image */}
                        {isInView && (mediaType === 'image' || mediaType === 'gif') && (
                            <motion.img
                                src={optimizedUrl}
                                alt={alt || title}
                                loading="lazy"
                                onLoad={() => handleLoad(currentUrl)}
                                onError={() => handleError(currentUrl)}
                                initial={{ opacity: 0, scale: 1.02 }}
                                animate={{
                                    opacity: isCurrentLoaded ? 1 : 0,
                                    scale: isCurrentLoaded ? 1 : 1.02
                                }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                className="absolute inset-0 w-full h-full object-contain"
                                draggable={false}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Play button for videos */}
                {(mediaType === 'video' || showPlayButton) && (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); handleClick(); }}
                        className={`absolute bottom-4 right-4 w-12 h-12 rounded-full border flex items-center justify-center backdrop-blur-sm transition-all z-10 ${isPrecision
                            ? 'bg-cyber-blue/30 border-cyber-blue/50 hover:bg-cyber-blue/50'
                            : 'bg-safety-orange/30 border-safety-orange/50 hover:bg-safety-orange/50'
                            }`}
                    >
                        <Play className={`w-5 h-5 ${isPrecision ? 'text-cyber-blue' : 'text-safety-orange'}`} fill="currentColor" />
                    </motion.button>
                )}

                {/* Animated badge */}
                {isAnimated && (
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm z-10 ${isPrecision
                            ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30'
                            : 'bg-safety-orange/20 text-safety-orange border border-safety-orange/30'
                            }`}
                    >
                        ▶ Video
                    </motion.div>
                )}

                {/* Expand hint on hover */}
                {enableLightbox && isHovered && !isAnimated && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-deep-black/80 backdrop-blur-md text-xs text-white font-medium z-10 shadow-lg"
                    >
                        Click to expand
                    </motion.div>
                )}

                {/* Navigation Dots */}
                {isGallery && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-deep-black/60 backdrop-blur-md rounded-full z-10"
                    >
                        {mediaUrls.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => { e.stopPropagation(); goToSlide(index); }}
                                className={`w-2 h-2 rounded-full transition-all duration-300 shadow-sm ${index === currentIndex
                                    ? 'bg-white w-6'
                                    : 'bg-white/40 hover:bg-white/70'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </motion.div>
                )}

                {/* Slide counter */}
                {isGallery && isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-deep-black/80 backdrop-blur-md text-xs text-white font-medium z-10 shadow-lg"
                    >
                        {currentIndex + 1} / {mediaUrls.length}
                    </motion.div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-deep-black/30 via-transparent to-transparent pointer-events-none" />
            </motion.div>

            {/* Lightbox Portal */}
            <Lightbox
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                mediaUrls={mediaUrls}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                isPrecision={isPrecision}
                title={title}
            />
        </>
    );
}
