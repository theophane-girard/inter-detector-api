import { CONFIG } from "../config/config";
import Axios from 'axios-observable';
import { AxiosRequestConfig } from 'axios';
import { HttpRequestLog } from '../models/http-request-log';

export class RiotService {
  protected api

  constructor() {
    this.api  = Axios.create({
      baseURL: CONFIG.apiV4Base + CONFIG.apiUrl,
      headers: {
        'X-Riot-Token': process.env.RIOT_API_KEY,
        'Content-Type': 'application/json',
      }
    });
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.log(error)
        
        return Promise.reject(error.response.data || error)
      }
    );
    this.api.interceptors.request.use(
      (request: AxiosRequestConfig) => {
        console.log(HttpRequestLog.factory(request))
        return request
      },
      (error) => Promise.reject(error.response.data || error)
    );
  }
}