import request, { IApiResult } from "@/api/request";
import { GET_LOGIN } from "@M/login/index";

// 登入
export const loginApi = (user: IUesr): Promise<IApiResult<ILoginResult>> =>
  request({
    url: `/User/Login`,
    method: "post",
    data: user,
    options: {
      hasMock: true,
      mockData: GET_LOGIN,
    },
  });

interface ILoginResult {
  ErrorMessage: string | null;
  IsSuccess: boolean;
}

interface IUesr {
  Account: string;
  Password: string;
}
