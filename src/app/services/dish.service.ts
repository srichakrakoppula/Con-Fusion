import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { baseURL } from '../shared/baseurl';
import { ProcessHttpmsgService } from './process-httpmsg.service';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

@Injectable()
export class DishService {

  constructor(private restangular: Restangular,
    private processHttpMsgService: ProcessHttpmsgService) { }

  getDishes() : Observable<Dish[]>{
    return this.restangular.all('dishes').getList();
  }

  getDish(id: number): Observable<Dish>{
    console.log(this.restangular.one('dishes',id));
    return this.restangular.one('dishes',id).get();
  }

  getFeaturedDish(): Observable<Dish>{
     return this.restangular.all('dishes').getList({featured: true})
     .map(res => res[0])
  }

  getDishIds(): Observable<number[]>{
    return this.getDishes()
    .map(dishes=> {return  dishes.map(dish => dish.id)});
  }
}
