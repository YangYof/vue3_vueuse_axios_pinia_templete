import request, { IApiResult, IAxiosConfig, IApiResponse } from "@/api/request";

export class AxiosSingltonService {
  private _promises: IPromise[];

  constructor() {
    this._promises = [];
  }

  request = <T extends IApiResponse> (axiosConfig: IAxiosConfig<T>): Promise<IApiResult<T>> => {
    let _instance = this._promises.find((promise) => promise.url === axiosConfig.url)?.instance;

    if (_instance === undefined) {
      _instance = request(axiosConfig);
      this._promises.push({
        url: axiosConfig.url,
        instance: _instance
      });
    }

    return _instance;
  };
}

interface IPromise {
  url: string;
  instance: any;
}