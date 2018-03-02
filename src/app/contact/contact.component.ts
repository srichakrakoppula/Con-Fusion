import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;
  formErrors ={
    'firstname':'',
    'lastname': '',
    'telnum':'',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required': 'First Name is required.',
      'minlength': 'First Name must be atleast 2 characters long',
      'maxlength': 'First Name cannot be more than 25 characters'
    },
    'lastname': {
      'required': 'Last Name is required.',
      'minlength': 'Last Name must be atleast 2 characters long',
      'maxlength': 'Last Name cannot be more than 25 characters'
    },
    'telnum': {
      'required': 'Tel. number is required',
      'pattern': 'Tel. number must contain only numbers'
    },
    'email':{
      'required': 'Email is required',
      'email': 'Email not in valid format'
    }
  }
  constructor(private fb: FormBuilder) { 
    this.createForm();
  }

  ngOnInit() {
  }

  createForm(){
    this.feedbackForm= this.fb.group({
      firstname: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: ['',[Validators.required, Validators.pattern]],
      email: ['',[Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: ''
    })

    this.feedbackForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); //(re)set form validation messages
  }

  onValueChanged(data?: any){
    if(!this.feedbackForm)  return;
    const form = this.feedbackForm;
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
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
  }
}
