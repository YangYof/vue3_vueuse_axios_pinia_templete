export interface IApiResult<T> {
  status: boolean;
  errorMessage: string;
  data: T;
}

export interface IAxiosOptions<T> {
  hasMock?: boolean;
  mockData?: IApiResult<T>;
}

export interface IAxiosConfig<T> {
  url: string;
  method: Method;
  data?: any;
  options?: IAxiosOptions<T>;
}

export interface IApiResponse {
  data: any;
  Error: any[];
  Code: number;
  Result: any;
  ResponseTime: string;
  ErrorMessage: string;
  IsSuccess: boolean;
}

import { Method } from "axios";
import axios from "./request";
import { AxiosSingltonService } from "./singleton";
import router from "@/router";

const handleLoginError = async (error: Error) => {
  const account = localStorage.getItem("Account");
  if (account) {
    if (confirm(`${error}，請重新登入`)) {
      router.push("/");
    } else {
      window.location.reload();
    }
  }
};

const request = async <T extends IApiResponse>(
  axiosConfig: IAxiosConfig<T>
): Promise<IApiResult<T>> => {
  return new Promise<IApiResult<T>>((resolve, reject) => {
    const { options: { hasMock = false, mockData = null } = {} } = axiosConfig;
    const isMockEnv = process.env.NODE_ENV === "mock";

    if (isMockEnv && hasMock) {
      const mock: IApiResult<T> = mockData || {
        status: true,
        errorMessage: "",
        data: null as any,
      };
      resolve(mock);
      return;
    }

    axios(axiosConfig)
      .then((response) => {
        const result: IApiResponse = response.data;
        const isSuccess = result.Code === 200;
        const resp: IApiResult<T> = {
          status: isSuccess,
          errorMessage: isSuccess
            ? ""
            : response.data.Error[0].Message ||
              response.data.ErrorMessage ||
              result,
          data: result.Result || response.data || response,
        };
        resolve(resp);
      })
      .catch(async (error) => {
        await handleLoginError(error);
        reject({
          status: false,
          errorMessage: error,
          data: null as any,
        });
      });
  });
};

export default request;

// singleton 版本
const singletonService = new AxiosSingltonService();
export const requestSingleton = singletonService.request;
