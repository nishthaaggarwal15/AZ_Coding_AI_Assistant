function extractUniqueId(url) {
    const match = url.match(/-(\d+)(?=\?|$)/);
    const id = match ? match[1] : null;
    return id;
}

(function () {
    const OriginalXHR = window.XMLHttpRequest;

    class InterceptedXHR extends OriginalXHR {
        constructor() {
            super();
            const id = extractUniqueId(window.location.href);
            this.addEventListener("readystatechange", () => {
                if (
                    this.readyState === 4 && 
                    this.status === 200 && 
                    this.responseURL === `https://api2.maang.in/problems/user/${id}` 
                ) {
                    const eventData = {
                        url: this.responseURL,
                        status: this.status,
                        method: this.method || "GET",
                        response: this.responseText,
                    };
                    document.dispatchEvent(
                        new CustomEvent("xhrIntercept", { detail: eventData })
                    );
                }
            });
        }
    }

    window.XMLHttpRequest = InterceptedXHR;

})();
