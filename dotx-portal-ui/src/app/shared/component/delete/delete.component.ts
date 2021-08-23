import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styles: [`
  .modal-confirm {
    color: #636363;
    width: 400px;
  }
  .modal-confirm .modal-content {
    padding: 20px;
    border-radius: 5px;
    border: none;
    text-align: center;
    font-size: 14px;
  }
  .modal-confirm .modal-header {
    border-bottom: none;
    position: relative;
  }
  .modal-confirm h4 {
    text-align: center;
    font-size: 26px;
    margin: 30px 0 -10px;
  }
  .modal-confirm .close {
    position: absolute;
    top: -5px;
    right: -2px;
    outline: none;
  }
  .modal-confirm .modal-body {
    color: #999;
  }
  .modal-confirm .modal-footer {
    border: none;
    text-align: center;
    border-radius: 5px;
    font-size: 13px;
    padding: 10px 15px 25px;
  }
  .modal-confirm .modal-footer a {
    color: #999;
  }
  .modal-confirm .btn, .modal-confirm .btn:active {
    color: #fff;
    border-radius: 4px;
    background: #60c7c1;
    text-decoration: none;
    transition: all 0.4s;
    line-height: normal;
    min-width: 120px;
    border: none;
    min-height: 40px;
    border-radius: 3px;
    margin: 0 5px;
  }
  .modal-confirm .btn-secondary {
    background: #c1c1c1;
  }
  .modal-confirm .btn-secondary:hover, .modal-confirm .btn-secondary:focus {
    background: #a8a8a8;
  }
  .modal-confirm .btn-danger {
    background: #f15e5e;
  }
  .modal-confirm .btn-danger:hover, .modal-confirm .btn-danger:focus {
    background: #ee3535;
  }
  .trigger-btn {
    display: inline-block;
    margin: 100px auto;
  }
  `]
})
export class DeleteComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void { }

  close(): void {
    this.activeModal.close(false);
  }
  removeRecord(): void {
    this.activeModal.close(true);
  }
}
