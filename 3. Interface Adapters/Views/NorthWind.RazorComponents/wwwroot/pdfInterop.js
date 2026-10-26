export function createBlobUrl(bytes) {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
}

export function revokeUrl(url) {
    if (url) {
        URL.revokeObjectURL(url);
    }
}

export function print(frame) {
    if (frame && frame.contentWindow) {
        frame.contentWindow.print();
    }
}
