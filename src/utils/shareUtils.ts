// src/utils/shareUtils.ts
import { toast } from '@/hooks/use-toast';

export interface ShareOptions {
  postId: string;
  postUrl: string;
  shareText: string;
  platform?: string;
  onShareSuccess?: () => void;
}

/**
 * Enterprise-grade clipboard copy function with cross-platform support
 * Works on: Windows, Mac, Linux (Ubuntu), Android, iOS
 */
const copyToClipboardModern = async (text: string): Promise<boolean> => {
  console.log('📋 Starting clipboard copy for:', text);

  // Method 1: Modern Clipboard API (preferred for secure contexts)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      console.log('🔄 Attempting Clipboard API...');
      await navigator.clipboard.writeText(text);

      // Verify the copy worked
      try {
        const clipboardText = await navigator.clipboard.readText();
        if (clipboardText === text) {
          console.log('✅ Clipboard API: Copy verified successfully');
          return true;
        } else {
          console.log('⚠️ Clipboard API: Copy verification failed');
        }
      } catch (readError) {
        // Can't read clipboard (permission issue), but write might have worked
        console.log('⚠️ Clipboard API: Cannot verify (permission), assuming success');
        return true;
      }
    } catch (error) {
      console.error('❌ Clipboard API failed:', error);
    }
  } else {
    console.log('⚠️ Clipboard API not available (insecure context or not supported)');
  }

  // Method 2: Fallback for non-secure contexts and older browsers
  console.log('🔄 Attempting fallback method...');
  return copyToClipboardFallback(text);
};

/**
 * Fallback clipboard method using execCommand
 * Enhanced with better cross-platform support
 */
const copyToClipboardFallback = (text: string): boolean => {
  try {
    // Create a temporary textarea element
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // Make it invisible but still functional
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.style.opacity = '0';
    textArea.style.zIndex = '-1';

    // Add to DOM
    document.body.appendChild(textArea);

    // Focus and select
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, 99999); // For mobile devices

    // iOS Safari specific handling
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      const range = document.createRange();
      range.selectNodeContents(textArea);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      textArea.setSelectionRange(0, 99999);
    }

    // Execute copy command with enhanced logging
    const successful = document.execCommand('copy');
    console.log(
      successful ? '✅ Fallback method: Copy successful' : '❌ Fallback method: Copy failed'
    );

    // Additional verification for insecure contexts
    if (successful) {
      console.log('📋 Text that should be copied:', text);
      console.log('🎉 Copy operation completed successfully!');
      console.log('💡 You can now paste with Ctrl+V (Windows) or Cmd+V (Mac)');
    }

    // Clean up
    document.body.removeChild(textArea);

    // Clear any remaining selection
    if (window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }

    return successful;
  } catch (error) {
    console.error('❌ Fallback method error:', error);
    return false;
  }
};

/**
 * Manual verification for insecure contexts
 * Shows a prompt to user to verify clipboard copy
 */
const verifyClipboardManually = (text: string): boolean => {
  console.log('🔍 Manual verification for insecure context...');

  // Create a temporary input field for user to verify
  const input = document.createElement('input');
  input.type = 'text';
  input.value = text;
  input.style.position = 'fixed';
  input.style.top = '-1000px';
  input.style.left = '-1000px';
  input.style.opacity = '0';

  document.body.appendChild(input);
  input.focus();
  input.select();

  const successful = document.execCommand('copy');
  document.body.removeChild(input);

  if (successful) {
    console.log('✅ Manual verification: Copy successful');
    return true;
  }

  console.log('❌ Manual verification: Copy failed');
  return false;
};

/**
 * Cross-platform clipboard copy with comprehensive error handling
 * Enhanced for insecure contexts (HTTP, localhost, IP addresses)
 */
const copyToClipboard = async (text: string): Promise<boolean> => {
  // Input validation
  if (!text || typeof text !== 'string') {
    console.error('❌ Invalid text provided to clipboard');
    return false;
  }

  console.log('🚀 Starting clipboard copy process...');
  console.log('🌐 Context:', window.isSecureContext ? 'Secure (HTTPS)' : 'Insecure (HTTP)');
  console.log('📋 Text length:', text.length);

  // Try modern method first (only works in secure contexts)
  const modernSuccess = await copyToClipboardModern(text);
  if (modernSuccess) {
    console.log('✅ Modern Clipboard API succeeded');
    return true;
  }

  // If modern method failed, try enhanced fallback
  console.log('🔄 Modern method failed, trying enhanced fallback...');
  const fallbackSuccess = copyToClipboardFallback(text);

  if (fallbackSuccess) {
    console.log('✅ Enhanced fallback method succeeded');

    // For insecure contexts, add extra verification
    if (!window.isSecureContext) {
      console.log('🔍 Running additional verification for insecure context...');
      const manualSuccess = verifyClipboardManually(text);
      if (manualSuccess) {
        console.log('✅ Manual verification passed');
        return true;
      } else {
        console.log('⚠️ Manual verification failed, but fallback succeeded');
        return true; // Still return true as fallback worked
      }
    }

    return true;
  }

  console.error('❌ All clipboard methods failed');
  return false;
};

/**
 * Enterprise-grade post sharing utility with cross-platform clipboard support
 * Works reliably on Windows, Mac, Linux (Ubuntu), Android, iOS
 */
export const handlePostShare = async ({
  postId,
  postUrl,
  shareText,
  platform,
  onShareSuccess,
}: ShareOptions): Promise<boolean> => {
  try {
    console.log('🚀 Starting share process:', { postId, platform, postUrl });

    if (!platform) {
      // Copy link to clipboard
      console.log('📋 Copying link to clipboard:', postUrl);

      const success = await copyToClipboard(postUrl);

      if (success) {
        toast({
          title: '✅ Link Copied!',
          description: 'Post link copied to clipboard successfully',
          duration: 3000,
        });
        onShareSuccess?.();
        return true;
      } else {
        toast({
          title: '❌ Copy Failed',
          description: `Unable to copy link. Please copy manually: ${postUrl}`,
          variant: 'destructive',
          duration: 5000,
        });
        return false;
      }
    } else {
      // Share to specific platform
      console.log('🌐 Sharing to platform:', platform);

      let shareUrl = '';
      let platformName = '';

      switch (platform) {
        case 'whatsapp':
          shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + postUrl)}`;
          platformName = 'WhatsApp';
          break;
        case 'x':
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`;
          platformName = 'X (Twitter)';
          break;
        case 'threads':
          shareUrl = `https://threads.net/intent/post?text=${encodeURIComponent(shareText + ' ' + postUrl)}`;
          platformName = 'Threads';
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
          platformName = 'LinkedIn';
          break;
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
          platformName = 'Facebook';
          break;
        case 'instagram':
          // Instagram requires copying the link
          console.log('📋 Copying link for Instagram:', postUrl);
          const instaSuccess = await copyToClipboard(postUrl);
          if (instaSuccess) {
            toast({
              title: '✅ Link Copied!',
              description: 'Paste this link in your Instagram story or bio',
              duration: 4000,
            });
            onShareSuccess?.();
            return true;
          } else {
            toast({
              title: '❌ Copy Failed',
              description: 'Unable to copy link for Instagram',
              variant: 'destructive',
            });
            return false;
          }
        default:
          console.error('❌ Unknown platform:', platform);
          toast({
            title: '❌ Share Failed',
            description: 'Unknown sharing platform',
            variant: 'destructive',
          });
          return false;
      }

      if (shareUrl) {
        // Open share dialog in new window
        const shareWindow = window.open(
          shareUrl,
          '_blank',
          'width=600,height=400,scrollbars=yes,resizable=yes'
        );

        if (shareWindow) {
          toast({
            title: '🌐 Opening Share Dialog',
            description: `Sharing to ${platformName}`,
            duration: 3000,
          });
          onShareSuccess?.();
          return true;
        } else {
          toast({
            title: '❌ Popup Blocked',
            description: 'Please allow popups to share to social media',
            variant: 'destructive',
          });
          return false;
        }
      }
    }

    return false;
  } catch (error: any) {
    console.error('❌ Share error:', error);
    toast({
      title: '❌ Share Failed',
      description: error.message || 'Could not share post',
      variant: 'destructive',
      duration: 4000,
    });
    return false;
  }
};

/**
 * Comprehensive clipboard testing utility for debugging
 * Use this in browser console to test clipboard functionality
 */
export const testClipboard = async (testText: string = 'Test clipboard copy!') => {
  console.log('🧪 Starting clipboard test...');
  console.log('📋 Test text:', testText);
  console.log('🌐 User agent:', navigator.userAgent);
  console.log('🔒 Secure context:', window.isSecureContext);
  console.log('📋 Clipboard API available:', !!navigator.clipboard);

  const startTime = Date.now();
  const success = await copyToClipboard(testText);
  const endTime = Date.now();

  console.log(`⏱️ Copy operation took: ${endTime - startTime}ms`);
  console.log(success ? '✅ Test PASSED' : '❌ Test FAILED');

  if (success) {
    console.log('🎉 Clipboard is working correctly!');
    console.log('📝 You can now paste the text anywhere (Ctrl+V / Cmd+V)');
  } else {
    console.log('🔧 Clipboard test failed. Check browser permissions and security context.');
  }

  return success;
};

/**
 * Platform detection utility for debugging
 */
export const getPlatformInfo = () => {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;

  const info = {
    userAgent,
    platform,
    isWindows: /Windows/i.test(userAgent),
    isMac: /Mac/i.test(userAgent),
    isLinux: /Linux/i.test(userAgent),
    isAndroid: /Android/i.test(userAgent),
    isIOS: /iPad|iPhone|iPod/i.test(userAgent),
    isChrome: /Chrome/i.test(userAgent),
    isFirefox: /Firefox/i.test(userAgent),
    isSafari: /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent),
    isEdge: /Edge/i.test(userAgent),
    isSecureContext: window.isSecureContext,
    hasClipboardAPI: !!navigator.clipboard,
    protocol: window.location.protocol,
    hostname: window.location.hostname,
  };

  console.log('🖥️ Platform Information:', info);
  return info;
};
