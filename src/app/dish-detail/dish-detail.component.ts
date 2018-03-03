import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { visibility, flyInOut, expand } from '../animations/app.animation';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-dish-detail',
  templateUrl: './dish-detail.component.html',
  styleUrls: ['./dish-detail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    visibility(),
    expand()
  ]
})


export class DishDetailComponent implements OnInit {
  dish: Dish;
  dishCopy = null;
  dishIds: number[];
  prev: number;
  next: number;

  commentForm: FormGroup;
  commentPreview: Comment;

  errMess: string;
  visibility = 'shown';

  formErrors = {
    'author':'',
    'comment': ''
  }

  validationMessages = {
    'author':{
      'required': 'Name is required.',
      'minlength': 'Name must be atleast 2 characters long',
      'maxlength': 'Name cannot be more than 25 characters'
    },
    'comment':{
      'required': 'Comment is required.'
    }
  }

  constructor(private dishservice: DishService, 
    @Inject('BaseURL') private BaseURL,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder) { 
      this.createForm();
    }

  ngOnInit() {
    this.dishservice.getDishIds()
    .subscribe(dishIds => this.dishIds = dishIds);
    this.route.params
    .switchMap((params: Params) => {this.visibility = 'hidden'; return this.dishservice.getDish(+params['id'])}) //returns an observable Dish
    .subscribe(dish => { 
      this.dish = dish;
      this.dishCopy = dish;
      this.setPrevNext(dish.id);
      this.visibility = 'shown';
    }, errmess => this.errMess = <any>errmess); 
  }

  setPrevNext(dishId:number){
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length]
    this.next = this.dishIds[(index + 1) % this.dishIds.length]
  }

  goBack(): void {
    this.location.back();
  }

  createForm(){
    this.commentForm= this.fb.group({
      author: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      rating: 5,
      comment: ['',Validators.required]
    })

    this.commentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); //(re)set form validation messages
  }

  onValueChanged(data?: any){
    if(!this.commentForm)  return;
    this.commentPreview = this.commentForm.value;
    const form = this.commentForm;
    for(const field in this.formErrors){
      this.formErrors[field] = ''; //remove if we have already attached error msgs to this field
      const control = form.get(field);
      if(control && control.dirty && !control.valid){
        const msgs = this.validationMessages[field];
        for(const key in control.errors){
          this.formErrors[field] += msgs[key]+' '
        }
      }
    }
  }

  onSubmit(){
    this.commentPreview = this.commentForm.value;
    this.commentPreview.date = new Date().toISOString();
    this.dishCopy.comments.push(this.commentPreview);
    this.dishCopy.save().subscribe(dish => this.dish = dish);
    //console.log(this.commentPreview);
    this.commentForm.reset({
      author: '',
      comment: ''
    });
  }


}
 