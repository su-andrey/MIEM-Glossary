const waitForImagesToLoad = (containerSelector) => {
    return new Promise((resolve) => {
        const container = document.querySelector(containerSelector);
        const images = container?.querySelectorAll("img") || [];

        let loaded = 0;
        if (images.length === 0) return resolve();

        images.forEach((img) => {
            if (img.complete) {
                loaded++;
                if (loaded === images.length) resolve();
            } else {
                img.onload = img.onerror = () => {
                    loaded++;
                    if (loaded === images.length) resolve();
                };
            }
        });
    });
};
export default waitForImagesToLoad;