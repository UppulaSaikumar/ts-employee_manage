import { axios as Instance } from "./service";
import { AxiosResponse } from "axios";

class HttpRequest {

  delete(url: string, empId: number): Promise<AxiosResponse<any>> {
    return Instance.delete(`${url}/${empId}`);
  }

  get(url: string): Promise<AxiosResponse<any>> {
    return Instance.get(`${url}`);
  }
  post(url: string, data: any): Promise<AxiosResponse<any>> {
    return Instance.post(`${url}`, data);
  }

  put(url: string, empId: number, data: any): Promise<AxiosResponse<any>> {
    return Instance.put(`${url}/${empId}`, data);
  }
}

const HttpClient = new HttpRequest();

export { HttpClient };
