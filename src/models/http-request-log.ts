import { AxiosRequestConfig } from "axios";

export class HttpRequestLog{

  constructor(
    public url?: string,
    public method?: string,
    public baseURL?: string,
    public headers?: string,
    public params?: string,
  ) {}

  static factory(conf: AxiosRequestConfig) {
    let h = new HttpRequestLog()
    h.url = conf.url
    h.method = conf.method
    h.baseURL = conf.baseURL
    h.headers = conf.headers
    h.params = conf.params
    return h
  }
}