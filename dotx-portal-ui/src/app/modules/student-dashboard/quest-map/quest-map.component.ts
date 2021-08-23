import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-quest-map',
  templateUrl: './quest-map.component.html',
  styleUrls: ['./quest-map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestMapComponent implements OnInit {
  questId= 221;
  encodedQuestID: string;

  constructor() { }

  ngOnInit() {
    setTimeout( ()=>{
      // Testimonials Slider Script
      jQuery('.daily-dot-slider').slick({
        dots: true,
        infinite: true,
        speed: 500,
        arrows: false
      });
    }, 1000);
    this.encodedQuestID = btoa(this.questId.toString());
  }

}
