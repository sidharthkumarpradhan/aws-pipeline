import { Component, ElementRef, forwardRef, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const noop = () => {};

@Component({
    selector: 'app-search',
    template: `
        <input type="text" class="form-control" placeholder="Search" [(ngModel)]="value" (ngModelChange)="onPaste($event)" autocomplete="disabled">
        <button class="btn btn-link search-icon" type="button">
            <img src="assets/img/search-icon.png"  alt="">
        </button>
        `,
        providers: [{
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SearchComponent),
            multi: true,
        }]
    })
    export class SearchComponent implements ControlValueAccessor{
    /* <input type="search" placeholder="Search" class="form-control form-control-sm" [(ngModel)]="value" autocomplete="disabled" />
    <input class="btn-search" type="button" name="search" (click)="searchClass = !searchClass" /> */
        private innerValue: any = '';
        searchClass = false;
        @ViewChild('searchText', {static: false}) searchText: ElementRef;
        @ViewChild('searchTextButton', {static: false}) searchTextButton: ElementRef;

        //by the Control Value Accessor
        private onTouchedCallback: () => void = noop;
        private onChangeCallback: (_: any) => void = noop;
    
        //get accessor
        get value(): any {
            return this.innerValue;
        }

        onPaste(value: any) {
            // this.innerValue = value;
          }
    
        //set accessor including call the onchange callback
        set value(v: any) {
            if (v !== this.innerValue) {
                this.innerValue = v;
                this.onChangeCallback(v);
            }
        }
    
        //From ControlValueAccessor interface
        writeValue(value: any) {
            if (value !== this.innerValue) {
                this.innerValue = value;
            }
        }
    
        //From ControlValueAccessor interface
        registerOnChange(fn: any) {
            this.onChangeCallback = fn;
        }
    
        //From ControlValueAccessor interface
        registerOnTouched(fn: any) {
            this.onTouchedCallback = fn;
        }
}
