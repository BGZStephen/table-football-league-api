import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { environment } from 'environments/environment';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {

  baseUrl: string = environment.apiUrl;
  authorization: String = environment.authorization;

  constructor(
    private http: Http,
    private router: Router,
  ) {}

  leagues = {
    get: (id) => {
      const callParams = {
        type: 'get',
        url: `/leagues/${id}`,
      }
      return this.apiCall(callParams);
    },

    getAll: () => {
      const callParams = {
        type: 'get',
        url: '/leagues'
      }
      return this.apiCall(callParams);
    },

    create: (league) => {
      const callParams = {
        type: 'post',
        url: '/leagues',
        body: league,
      }
      return this.apiCall(callParams);
    },

    delete: (id) => {
      const callParams = {
        type: 'delete',
        url: `/league/${id}`,
      }
      return this.apiCall(callParams);
    },

    update: (league) => {
      const callParams = {
        type: 'put',
        url: `/work-examples/${league}`,
        body: league
      }
      return this.apiCall(callParams);
    },
  }

  apiCall(callParams) {
    const headers = new Headers();
    headers.append('Authorization', `${this.authorization}`);
    return this.http[`${callParams.type}`](`${this.baseUrl}${callParams.url}`, `${callParams.body ? callParams.body : {headers: headers}}`, `${callParams.body ? {headers: headers} : ''}`)
    .map(res => res.json());
  }
}
