import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, FormControl } from '@angular/forms';
import { AppSettings } from 'src/app/config/app.settings';
import { UserService } from 'src/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbDatepicker, NgbDate, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';




@Component({
  selector: 'app-user-cadastro',
  templateUrl: './user-cadastro.component.html',
  styleUrls: ['../user.component.css']
})
export class UserCadastroComponent implements OnInit {


  public usuario: User;
  pageTitle: string;
  hoje = new Date;
  dataLimite = { 'year': this.hoje.getFullYear(), 'month': this.hoje.getMonth(), 'day': this.hoje.getDay() };
  bc: []
  messageError: string
  resposta: any = { formError: {} }
  idUser: number
  private cadastroForm: FormGroup;

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private api: UserService, private router: Router, private ngbDateParserFormatter: NgbDateParserFormatter) {
    this.usuario = new User();
    this.idUser = parseInt(this.route.snapshot.paramMap.get("id"))
    this.createForm();
    if (this.idUser > 0) {
      this.getUser(this.idUser);
    }


  }

  ngOnInit() {

    this.pageTitle = this.route.snapshot.data.pageTitle;
    this.bc = this.route.snapshot.data.bc;
  }

  createForm() {
    this.cadastroForm = this.formBuilder.group({
      email: [this.usuario.email, [Validators.required, Validators.email]],
      nome: [this.usuario.name, [Validators.required]],
      surname: [this.usuario.surname, [Validators.required]],
      UserName: [this.usuario.userName],
      password: [this.usuario.password],
      registerDate: [this.usuario.registerDate],
      isEnable: [this.usuario.isEnable],
      phone: [this.usuario.phone, [Validators.required]],
    });
  }

  getUser(id: number) {
    this.api.getById(id).subscribe(
      response => {
        this.usuario = response
        this.createForm();
      }
    );
  }

  public salvar() {

    if (this.cadastroForm.invalid) {
      this.messageError = "Favor validar os campos do formulário"
    }

    this.usuario.email = this.cadastroForm.get('email').value;
    let dataForm: NgbDate = this.cadastroForm.get('registerDate').value;
    if (dataForm) {      
      this.usuario.registerDate = new Date(dataForm.year, dataForm.month-1, dataForm.day);
    }
    this.usuario.name = this.cadastroForm.get('name').value;
    this.usuario.surname = this.cadastroForm.get('surname').value;
    this.usuario.phone = this.cadastroForm.get('phone').value;
    this.usuario.isEnable = this.cadastroForm.get('isEnable').value;
    this.usuario.password = this.cadastroForm.get('password').value;


    if (this.usuario.id) {
      this.api.update(this.usuario).subscribe(
        (response) => {
          
          this.resposta = response;
          if (response.id) {
            this.router.navigate(['/user'])
          } else {
            this.messageError = "Não foi possível salvar.";
          }

        }, (err: HttpErrorResponse) => {

          if (err.error.formError) {
            this.resposta = err.error;
          } else {
            this.messageError = err.error;
          }


        });
    } else {
      this.api.create(this.usuario).subscribe(
        (response) => {
          
          this.resposta = response;
          if (response.id) {
            this.router.navigate(['/user'])
          } else {
            this.messageError = "Não foi possível salvar.";
          }

        }, (err: HttpErrorResponse) => {

          if (err.error.formError) {
            this.resposta = err.error;
          } else {
            this.messageError = err.error;
          }


        });
    }



  }


  setDate(date): NgbDateStruct {
    var startDate = new Date(date);        
    return {year:startDate.getUTCFullYear(),month:startDate.getUTCMonth()+1,day:startDate.getUTCDate()}

  }


}
