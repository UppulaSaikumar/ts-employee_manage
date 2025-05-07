/* eslint-disable @typescript-eslint/no-explicit-any */
import { axios as Instance } from "./service";
import { AxiosResponse } from "axios";

class HttpRequest {

  delete(url: string, empid: number): Promise<AxiosResponse<any>> {
    return Instance.delete(`${url}/${empid}`,{
      withCredentials:true
    });
  }

  get(url: string): Promise<AxiosResponse<any>> {
    return Instance.get(`${url}`,{
      withCredentials:true
    });
  }
  post(url: string, data: any): Promise<AxiosResponse<any>> {
    return Instance.post(`${url}`, data,{
      withCredentials:true
    });
  }

  put(url: string, empid: number, data: any): Promise<AxiosResponse<any>> {
    return Instance.put(`${url}/${empid}`, data,{
      withCredentials:true
    });
  }
}

const HttpClient = new HttpRequest();

export { HttpClient };
