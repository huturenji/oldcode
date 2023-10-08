function getError(option, xhr) {
    const msg = `cannot post ${option.action} ${xhr.status}'`;
    const err = new Error(msg);
    err.status = xhr.status;
    err.method = 'post';
    err.url = option.action;
    return err;
}

function getBody(xhr) {
    const text = xhr.responseText || xhr.response;
    if (!text) {
        return text;
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        return text;
    }
}

export default function upload(option) {
    const xhr = new window.XMLHttpRequest();
    const data = option.data;
    if (option.onProgress && xhr.upload) {
        xhr.upload.onprogress = function (e) {
            if (e.total > 0) {
                e.progress = parseInt((e.loaded / e.total) * 100);
            }
            option.onProgress(e);
        };
    }

    xhr.onreadystatechange = function () {
    };

    xhr.onloadstart = function () {
    };

    xhr.onerror = function error(e) {
        option.onError(e);
    };


    xhr.onload = function () {
        if (xhr.status < 200 || xhr.status >= 300) {
            return option.onError(getError(option, xhr), getBody(xhr));
        }

        option.onSuccess(getBody(xhr), xhr);
    };

    xhr.onloadend = function () {
        option.onEnd();
    };

    xhr.timeout = function () {

    };

    xhr.open('POST', option.action, true);

    let formData;

    if (option.file) {
        formData = new FormData();

        if (data) {
            Object.keys(data).map(key => {
                formData.append(key, data[key]);
            });
        }
        formData.append('file', option.file);
    } else {
        formData = '';
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                formData += key + '=' + data[key] + '&';
            }
        }
        formData = formData ? formData.slice(0, -1) : formData;
    }

    const headers = option.headers || {};
    for (const h in headers) {
        if (headers.hasOwnProperty(h) && headers[h] !== null) {
            xhr.setRequestHeader(h, headers[h]);
        }
    }

    xhr.send(formData);

    return {
        abort() {
            xhr.abort();
        }
    };
}
