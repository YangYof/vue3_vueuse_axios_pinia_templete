import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, AxiosRequestHeaders, InternalAxiosRequestConfig } from "axios";

export const service = axios.create({
  baseURL: process.env.NODE_ENV === "production" ? window.location.origin : "/api",
  withCredentials: true,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    "If-Modified-Since": "0"
  }
});

let isUpdateToken = false;

// HTTP request 攔截器
service.interceptors.request.use(
  (config: AxiosRequestConfig<any>): InternalAxiosRequestConfig<any> | Promise<InternalAxiosRequestConfig<any>> => {
    console.log('AxiosRequestConfig',config)
    const token = localStorage.getItem("Token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      } as AxiosRequestHeaders; // 這裡使用 `as` 進行類型轉換
    }
    return config as InternalAxiosRequestConfig<any>; // 這裡使用 `as` 進行類型轉換
  },
  (error: AxiosError<any>) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// http Response 攔截器
service.interceptors.response.use(
  (response:any) => {
    if (response.status >= 200 && response.status < 400) {
      if (
        response.data.code === 401 || response.data == "Token is not Valid , pls check !!!"
      ) {
        error401RejectHandler();
        return;
      }
      return response;
    }
    return Promise.reject(new Error(`取API失敗 \n URL: "${response.config.url}" \n STATUS: "${response.status}"`));
  },
  (error) => {
    const config = error.config;
    if (error.response.status === 400) {
      return error.response;
    } else if (error.response.status === 401) {
      return error401Hanlder(config);
    } else {
      return (error.response.data.Error = [
        {
          Field: "Error",
          Message: "系统错误"
        }
      ]);
    }
  }
);

function error401Hanlder(config: AxiosRequestConfig): Promise<AxiosResponse<any>> {
  // 由第一位負責打 refresh 就好，其他的人等刷新後再重新呼叫一次
  if (isUpdateToken) {
    return new Promise((resolve, reject) => {
      const intervalId = setInterval(() => {
        console.log('isUpdateToken')
        if (!isUpdateToken) {
          clearInterval(intervalId);

          const hasJwtToken = localStorage.getItem("Token") !== null;
          // 拿的到 token 代表刷新成功
          if (hasJwtToken) {
            resolve(service(config));
          } else {
            reject(new Error(`Reject url: ${config.url}`));
          }
        }
      }, 100);
    });
  } else {
    return new Promise((resolve) => {
      isUpdateToken = true;

      const updateInfo = {
        Account: localStorage.getItem("Account")!,
        RefreshToken: localStorage.getItem("RefreshToken")!
      };

      const isParamsValid = updateInfo.RefreshToken;

      if (!isParamsValid) {
        isUpdateToken = false;
        error401RejectHandler();
        return;
      }

    //   updateToken(updateInfo)
    //     .then((res: any) => {
    //       if (res) {
    //         const { Token, RefreshToken } = res.data;
    //         localStorage.setItem("Token", Token);
    //         localStorage.setItem("RefreshToken", RefreshToken);
    //       }
    //       resolve(service(config));
    //     })
    //     .finally(() => {
    //       isUpdateToken = false;
    //     });
    });
  }
}

async function error401RejectHandler() {
  // alert(`請重新登入`);
  localStorage.clear();
  window.location.href = process.env.NODE_ENV === "production" ? `/${location.pathname.split("/")[1]}` : "/";
}

export default service;
