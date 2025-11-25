import { useEffect } from 'react';

export const ProtectedContent = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const preventScreenshot = (e: KeyboardEvent) => {
      if (
        (e.key === 'PrintScreen') ||
        (e.ctrlKey && e.shiftKey && (e.key === 'S' || e.key === 's' || e.key === 'I' || e.key === 'i')) ||
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) ||
        (e.ctrlKey && (e.key === 'p' || e.key === 'P'))
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    const preventDrag = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('keydown', preventScreenshot);
    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('copy', preventCopy);
    document.addEventListener('cut', preventCopy);
    document.addEventListener('dragstart', preventDrag);

    const style = document.createElement('style');
    style.innerHTML = `
      body::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        background: transparent;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('keydown', preventScreenshot);
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('cut', preventCopy);
      document.removeEventListener('dragstart', preventDrag);
      document.head.removeChild(style);
    };
  }, []);

  return <div className="no-context-menu">{children}</div>;
};
