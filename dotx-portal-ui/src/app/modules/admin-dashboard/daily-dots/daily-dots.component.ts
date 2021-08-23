import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SUCCESS_MESSAGE, ERROR_MESSAGE } from 'src/app/shared/constant';
import * as XLSX from 'xlsx';
import { UploadService } from './../../../shared/modules/upload.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-daily-dots',
  templateUrl: './daily-dots.component.html'

})
export class DailyDotsComponent implements OnInit {
  @ViewChild('dailyQuoteInput', {static: false}) dailyQuoteInput: ElementRef;

  dailyQuoteHeaders: string[] = ['daily_dot_type', 'record_date', 'record_title', 'record_description', 'option1', 'option2', 'option3', 'option4', 'date_of_publish', 'record_status', 'is_active'];
  // tslint:disable-next-line: quotemark
  dailyQuoteData: any[] = [{"daily_dot_type":"Quote","record_date":'required date format yyyy-mm-dd 00:00:00',"record_title":"Daily Quote","record_description":"description","option1":"","option2":"","option3":"","option4":"","date_of_publish": 'required date format yyyy-mm-dd 00:00:00',"record_status":"Published","is_active":1},{"daily_dot_type":"Quote","record_date":'required date format yyyy-mm-dd 00:00:00',"record_title":"Daily Quote","record_description":"description","option1":"","option2":"","option3":"","option4":"","date_of_publish":'required date format yyyy-mm-dd 00:00:00',"record_status":"Published","is_active":1}];
  dailyPoll: string[] = ['daily_dot_type', 'record_date',	'record_title',	'record_description',	'option1',	'option2',	'option3', 'option4', 'date_of_publish', 'record_status', 'is_active'];
  dailyPollData: any[] = [{'daily_dot_type':'Poll','record_date':'yyyy-mm-dd 00:00:00','record_title':'Daily poll','record_description':'Daily poll description','option1':'Day 24 O1','option2':'Day 24 O2','option3':'Day 24 O3','option4':'Day 24 O4','date_of_publish':'yyyy-mm-dd 00:00:00','record_status':'Published','is_active':1},{'daily_dot_type':'Poll','record_date':'yyyy-mm-dd 00:00:00','record_title':'Daily poll','record_description':'Daily poll description','option1':'Day 25 O1','option2':'Day 25 O2','option3':'Day 25 O3','option4':'Day 25 O4','date_of_publish':'yyyy-mm-dd 00:00:00','record_status':'Published','is_active':1}];
  todayQuestion: any[] = [{"daily_dot_type":"Anactode","record_date":"yyyy-mm-dd 00:00:00","record_title":"Today�s question","record_description":"description","option1":"Day 24 O1","option2":"Day 24 O2","option3":"Day 24 O3","option4":"Day 24 O4","date_of_publish":"yyyy-mm-dd 00:00:00","record_status":"Published","is_active":1},{"daily_dot_type":"Anactode","record_date":"yyyy-mm-dd 00:00:00","record_title":"Today�s question","record_description":"description","option1":"Day 25 O1","option2":"Day 25 O2","option3":"Day 25 O3","option4":"Day 25 O4","date_of_publish":"yyyy-mm-dd 00:00:00","record_status":"Published","is_active":1},{"daily_dot_type":"Anactode","record_date":"yyyy-mm-dd 00:00:00","record_title":"Today�s question","record_description":"description","option1":"Day 26 O1","option2":"Day 26 O2","option3":"Day 26 O3","option4":"Day 26 O4","date_of_publish":"yyyy-mm-dd 00:00:00","record_status":"Published","is_active":1}];
  gratitudeJournal: any[] = [{"daily_dot_type":"Gratitude","record_date":"yyyy-mm-dd 00:00:00","record_title":"Gratitude Journal","record_description":"description","option1":"","option2":"","option3":"","option4":"","date_of_publish":"yyyy-mm-dd 00:00:00","record_status":"Published","is_active":1},{"daily_dot_type":"Gratitude","record_date":"yyyy-mm-dd 00:00:00","record_title":"Gratitude Journal","record_description":"description","option1":"","option2":"","option3":"","option4":"","date_of_publish":"yyyy-mm-dd 00:00:00","record_status":"Published","is_active":1}];

  templateToExcel: string[][] = [this.dailyQuoteHeaders,this.dailyQuoteData];
  imageName: string = 'Choose file';
  dailyQuoteFileName: string = 'Choose file';
  labelName2: string = 'Choose file';
  labelName3: string = 'Choose file';
  labelName4: string = 'Choose file';
  selectedImage1: File;
  selectedImage2: File;
  selectedImage3: File;
  selectedImage4: File;
  maxFileSize = 20971520;
  uploadBtnDisable: boolean;
  allowedFileTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  acceptTypes = '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';
  upload1BtnDisable: boolean;
  upload2BtnDisable: boolean;
  upload3BtnDisable: boolean;
  upload4BtnDisable: boolean;

  constructor(private toastrService: ToastrService,
              private uploadService: UploadService) { }

  ngOnInit() {
  }

  downloadFile(type: string): void {
    let fileData = [];
    let filename = 'file';
    if (type === 'dailyQuote') {
      fileData = this.dailyQuoteData;
      filename = 'dot_quote.csv';
    } else if (type === 'todayQuestion') {
      fileData = this.todayQuestion;
      filename = 'dot_anectode.csv';
    } else if (type === 'dailyPoll') {
      fileData = this.dailyPollData;
      filename = 'dot_poll.csv';
    } else if (type === 'gratitudeJournal') {
      fileData = this.gratitudeJournal;
      filename = 'dot_gratitude.csv';
    }
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(fileData);
    const csvOutput: string = XLSX.utils.sheet_to_csv(worksheet);
    this.saveAsExcelFile(csvOutput, filename);
  }

  saveAsExcelFile(value: any, filename: string): void {
    const data: Blob = new Blob([value], {
      type: 'application/octet-stream'
    });
    FileSaver.saveAs(data, filename);
  }

  onInputClick(event: any): any {
    const element =  event.target as HTMLInputElement;
    element.value = '';
  }

  onSelectFile(event: any, label): any {
    this.imageName = 'Choose file';
    const sizeInMB = (this.maxFileSize / (1024 * 1024)).toFixed(2);
    if (event.target.files && event.target.files[0]) {
        console.log(event.target.files[0].type);
        if (this.allowedFileTypes.indexOf(event.target.files[0].type) === -1) {
            this.toastrService.warning('Please select valid File / Format');
          } else if (event.target.files[0].size && event.target.files[0].size > this.maxFileSize) {
            this.toastrService.warning('File size should be between 120KB to ' + sizeInMB + 'MB');
            setTimeout(() => {
            }, 1500);
          } else if (!this.validateFileName(event.target.files[0].name)) {
            this.toastrService.warning('Invalid Filename. Only underscore and hyphen special characters are allowed in a Filename.');
          } else if (event.target.files[0].name) {
            const filename = event.target.files[0].name;
            const file: File = event.target.files[0];
            const filetype =  filename.split('.').pop();
            if (filetype !== 'csv' ) {
              this.toastrService.warning('Please select valid File / Format');
              return false;
            }
            if (label === 1) {
              this.dailyQuoteFileName = filename;
              this.selectedImage1 = file;
            } else if (label === 2) {
              this.labelName2 = filename;
              this.selectedImage2 = file;
            } else if (label === 3) {
              this.labelName3 = filename;
              this.selectedImage3 = file;
            } else if (label === 4) {
              this.labelName4 = filename;
              this.selectedImage4 = file;
            }
          }
      }
  }

  validateFileName(name: string): any {
    return name.match(/^[0-9a-zA-Z\_\-. ()]+$/);
  }

  uploadFile(type) {
    let fileData: File;
    if (type === 1) { fileData = this.selectedImage1; }
    if (type === 2) { fileData = this.selectedImage2; }
    if (type === 3) { fileData = this.selectedImage3; }
    if (type === 4) { fileData = this.selectedImage4; }
    if (!fileData) {
      this.toastrService.warning(ERROR_MESSAGE.VALID_FILE);
      return false;
    }
    this.enableBtn(type, true);
    this.uploadService.uploadDailyDot(fileData).subscribe((resp) => {
      this.uploadBtnDisable = false;
      if (resp) {
        this.toastrService.success(SUCCESS_MESSAGE.DATA_ADDED);
        // this.setFileData(type);
      }
      this.enableBtn(type, false);
    }, err => {
      this.enableBtn(type, false);
    });
  }

  enableBtn(type: number, value: boolean): void {
    if (type === 1) { this.upload1BtnDisable  = value;}
    if (type === 2) { this.upload2BtnDisable  = value;}
    if (type === 3) { this.upload3BtnDisable  = value;}
    if (type === 4) { this.upload4BtnDisable  = value;}
  }

  setFileData(type): void {
    if (type === 1) {
      this.dailyQuoteFileName = 'Choose file';
      this.selectedImage1 = null;
      this.dailyQuoteInput.nativeElement.value = '';
    } else if (type === 2) {
      this.labelName2 = 'Choose file';
      this.selectedImage2 = null;
      // this.dailyQuoteInput.nativeElement.value = '';
    } else if (type === 3) {
      this.labelName3 = 'Choose file';
      this.selectedImage3 = null;
      // this.dailyQuoteInput.nativeElement.value = '';
    } else if (type === 4) {
      this.labelName4 = 'Choose file';
      this.selectedImage4 = null;
      // this.dailyQuoteInput.nativeElement.value = '';
    }
  }


}
