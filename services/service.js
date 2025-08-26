import axios from "axios";
// const ConstantsUrl = "http://localhost:3000/v1/api/";

export const ConstantsUrl = "https://apis.krytonline.com/v1/api/";

// export const ConstantsUrl = "http://localhost:3000/v1/api/";

// "https://sp-app-api.herokuapp.com"

function Api(method, url, data, router, params) {
  return new Promise(function (resolve, reject) {
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage?.getItem("token") || "";
    }
    console.log(token);
    axios({
      method,
      url: ConstantsUrl + url,
      data,
      headers: { Authorization: `jwt ${token}` },
      params
    }).then(
      (res) => {
        resolve(res.data);
      },
      (err) => {
        console.log(err);
        if (err.response) {
          if (err?.response?.status === 401) {
            if (
              typeof window !== "undefined" &&
              !router.pathname.includes("signIn")
            ) {
              localStorage.removeItem("userDetail");
              router.push("/auth/signIn/");
              err.response.data.message = 'Login required'
            }
          }
          reject(err.response.data);
        } else {
          reject(err);
        }
      }
    );
  });
}

function ApiFormData(method, url, data, router) {
  return new Promise(function (resolve, reject) {
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage?.getItem("token") || "";
    }
    console.log(token);
    axios({
      method,
      url: ConstantsUrl + url,
      data,
      headers: {
        Authorization: `jwt ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }).then(
      (res) => {
        resolve(res.data);
      },
      (err) => {
        console.log(err);
        if (err.response) {
          if (err?.response?.status === 401) {
            if (typeof window !== "undefined") {
              localStorage.removeItem("userDetail");
              router.push("/");
            }
          }
          reject(err.response.data);
        } else {
          reject(err);
        }
      }
    );
  });
}

const timeSince = (date) => {
  date = new Date(date);
  const diff = new Date().valueOf() - date.valueOf();
  const seconds = Math.floor(diff / 1000);
  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " Years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return (
      Math.floor(interval) +
      (Math.floor(interval) > 1 ? " Months" : " Month") +
      " ago"
    );
  }
  interval = seconds / 604800;
  if (interval > 1) {
    return (
      Math.floor(interval) +
      (Math.floor(interval) > 1 ? " Weeks" : " Week") +
      " ago"
    );
  }

  interval = seconds / 86400;
  if (interval > 1) {
    return (
      Math.floor(interval) +
      (Math.floor(interval) > 1 ? " Days" : " Day") +
      " ago"
    );
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return (
      Math.floor(interval) +
      (Math.floor(interval) > 1 ? " Hours" : " Hour") +
      " ago"
    );
  }
  interval = seconds / 60;
  if (interval > 1) {
    return (
      Math.floor(interval) +
      (Math.floor(interval) > 1 ? " Min" : " min") +
      " ago"
    );
  }
  return "Just now";
};

function ApiGetPdf(url, data, router, params) {
  return new Promise(function (resolve, reject) {
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage?.getItem("token") || "";
    }

    axios({
      method: "POST",
      url: ConstantsUrl + url,
      data,
      headers: { Authorization: `jwt ${token}` },
      params,
      responseType: "blob",
    }).then(
      (res) => {
        const file = new Blob([res.data], { type: "application/pdf" });
        const fileURL = window.URL.createObjectURL(file);
        // window.open(fileURL); // open file in browser do not touch if not to open pdf immediatly

        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", "file.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        resolve(res.data);
      },
      (err) => {
        console.log("Error:", err);
        if (err.response) {
          const status = err.response.status;
          const message = err.response?.data?.message || "";

          if (
            (status === 401 || status === 403) &&
            typeof window !== "undefined"
          ) {
            if (
              message.toLowerCase().includes("jwt expired") ||
              message.toLowerCase().includes("unauthorized")
            ) {
              localStorage.removeItem("token");
              localStorage.removeItem("userDetail");
              router?.push("/signIn");
            }
          }
          reject(err.response.data);
        } else {
          reject(err);
        }
      }
    );
  });
}

const pdfDownload = async (fileName, data) => {
  return new Promise(function (resolve, reject) {
    pdfMake.vfs = {};
    pdfMake.jszip = jszip;
    pdfMake.DynamicContent = {
      content: {
        widths: "100%",
      },
    };
    pdfMake.fonts = {
      Roboto: {
        normal:
          "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
        bold: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
        italics:
          "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
        bolditalics:
          "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
      },
    };

    pdfmake.createPdf(data).download(fileName);
    pdfmake.createPdf(data).getDataUrl((blob) => {
      console.log("pdf======>", blob);

      resolve(blob);
    });
  });
};

export { Api, timeSince, ApiFormData, ApiGetPdf, pdfDownload };
