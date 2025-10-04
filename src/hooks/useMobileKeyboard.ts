import { useState, useEffect, useCallback } from 'react';

interface MobileKeyboardState {
  isMobile: boolean;
  keyboardOffset: number;
  isKeyboardOpen: boolean;
  viewportHeight: number;
  windowHeight: number;
}

interface UseMobileKeyboardOptions {
  threshold?: number; // Minimum offset to consider keyboard open (default: 150px)
  debounceMs?: number; // Debounce delay for updates (default: 16ms for 60fps)
}

export function useMobileKeyboard(options: UseMobileKeyboardOptions = {}): MobileKeyboardState {
  const { threshold = 150, debounceMs = 16 } = options;
  
  const [state, setState] = useState<MobileKeyboardState>({
    isMobile: false,
    keyboardOffset: 0,
    isKeyboardOpen: false,
    viewportHeight: 0,
    windowHeight: 0,
  });

  const updateKeyboardState = useCallback(() => {
    const isMobile = window.innerWidth <= 768;
    const windowHeight = window.innerHeight;
    let viewportHeight = windowHeight;
    let keyboardOffset = 0;
    let isKeyboardOpen = false;

    if (window.visualViewport && isMobile) {
      viewportHeight = window.visualViewport.height;
      keyboardOffset = Math.max(0, windowHeight - viewportHeight);
      isKeyboardOpen = keyboardOffset > threshold;
      
      // Set CSS variable for global access
      document.documentElement.style.setProperty('--kb-offset', `${keyboardOffset}px`);
      
      // Add/remove body class for global styling
      if (isKeyboardOpen) {
        document.body.classList.add('keyboard-open');
      } else {
        document.body.classList.remove('keyboard-open');
      }
    }

    setState({
      isMobile,
      keyboardOffset,
      isKeyboardOpen,
      viewportHeight,
      windowHeight,
    });
  }, [threshold]);

  useEffect(() => {
    let animationFrameId: number;
    let timeoutId: NodeJS.Timeout;
    let isCleaningUp = false;

    const debouncedUpdate = () => {
      if (isCleaningUp) return;
      
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        animationFrameId = requestAnimationFrame(updateKeyboardState);
      }, debounceMs);
    };

    const handleOrientationChange = () => {
      if (isCleaningUp) return;
      
      // Small delay to allow orientation change to complete
      setTimeout(() => {
        updateKeyboardState();
      }, 100);
    };

    // Initial setup
    updateKeyboardState();

    // Event listeners
    window.addEventListener('resize', debouncedUpdate);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Visual Viewport API with multiple event types
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', debouncedUpdate);
      window.visualViewport.addEventListener('scroll', debouncedUpdate);
    }

    // Fallback for browsers without Visual Viewport API
    if (!window.visualViewport) {
      window.addEventListener('resize', debouncedUpdate);
    }

    return () => {
      isCleaningUp = true;
      
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      window.removeEventListener('resize', debouncedUpdate);
      window.removeEventListener('orientationchange', handleOrientationChange);
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', debouncedUpdate);
        window.visualViewport.removeEventListener('scroll', debouncedUpdate);
      }
    };
  }, [updateKeyboardState, debounceMs]);

  return state;
}

// Utility function to scroll to element with keyboard awareness
export function scrollToElementWithKeyboard(
  element: HTMLElement | null,
  keyboardOffset: number = 0,
  behavior: ScrollBehavior = 'smooth'
) {
  if (!element) return;
  
  const elementRect = element.getBoundingClientRect();
  const viewportHeight = window.visualViewport?.height || window.innerHeight;
  const scrollPadding = 120 + keyboardOffset; // Base padding + keyboard offset
  
  // Calculate if element is above the visible area
  if (elementRect.bottom > viewportHeight - scrollPadding) {
    element.scrollIntoView({ 
      behavior,
      block: 'end',
      inline: 'nearest'
    });
  }
}

// Utility function to get safe area insets
export function getSafeAreaInsets() {
  const computedStyle = getComputedStyle(document.documentElement);
  return {
    top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0'),
    right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)') || '0'),
    bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
    left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)') || '0'),
  };
}

// Utility function to check if Visual Viewport API is supported
export function isVisualViewportSupported(): boolean {
  return typeof window !== 'undefined' && 'visualViewport' in window;
}

// Utility function to get current keyboard offset from CSS variable
export function getKeyboardOffset(): number {
  const offset = document.documentElement.style.getPropertyValue('--kb-offset');
  return parseInt(offset) || 0;
}
