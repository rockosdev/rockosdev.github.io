export function createAlbumOverlayController({ onBeforeDismiss, onAfterDismiss } = {}) {
    const overlay = document.getElementById('album-loading');
    const progressEl = document.getElementById('progress');
    const loadingTextEl = document.getElementById('loading-text');
    const enterBtn = document.getElementById('enter-btn');

    let dismissed = false;

    function setProgress(text) {
        if (progressEl) progressEl.textContent = text;
    }

    function setLoadingText(text) {
        if (loadingTextEl) loadingTextEl.textContent = text;
    }

    function markReadyToEnter() {
        if (!overlay) return;
        overlay.classList.add('is-ready');
        setLoadingText('模型已加载完成');
        setProgress('');
    }

    function dismiss() {
        if (dismissed) return;
        dismissed = true;

        const legacyLoading = document.getElementById('loading');
        if (legacyLoading) legacyLoading.style.display = 'none';
        if (!overlay) return;

        if (typeof onBeforeDismiss === 'function') {
            onBeforeDismiss();
        }

        overlay.classList.add('is-fading');
        window.setTimeout(() => {
            overlay.remove();
            if (typeof onAfterDismiss === 'function') {
                onAfterDismiss();
            }
        }, 480);
    }

    if (enterBtn) {
        enterBtn.addEventListener('click', dismiss);
    }

    return {
        dismiss,
        markReadyToEnter,
        setLoadingText,
        setProgress
    };
}
