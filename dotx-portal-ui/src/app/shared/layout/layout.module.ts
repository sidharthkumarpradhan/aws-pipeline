import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';


@NgModule({
  declarations: [FooterComponent, PrivacyPolicyComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  entryComponents: [PrivacyPolicyComponent],
  exports: [FooterComponent]
})
export class LayoutModule { }
