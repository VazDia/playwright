/**
 * 
 * REPARTITION PAGE > REFERENTIEL / ONGLET >  GESTION DES PRIORITES DE TRANSPORT
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page } from "@playwright/test"

export class RefGestionPrioritesTransportPage {
     //--------------------------------------------------------------------------------------------------------------

     public readonly inputFiltre     : Locator  //.locator('.priorites-filtres input');
     public readonly inputAppliquer  : Locator  //.locator('.application-en-masse > div > input');        
 
     public readonly dateExpedMag    : Locator  //.locator('[ng-click="toggleDatepicker($event)"]');
 
     public readonly headerList      : Locator  //.locator('table.table-condensed > thead > tr > th');
 
     public readonly buttonAppliquer : Locator  //.locator('.pull-right > button');
                 
     //--------------------------------------------------------------------------------------------------------------


     constructor(page:Page){

          //--------------------------------------------------------------------------------------------------------------

          this.inputFiltre      = page.locator('.priorites-filtres input');
          this.inputAppliquer   = page.locator('.application-en-masse > div > input');        

          this.dateExpedMag     = page.locator('[ng-click="toggleDatepicker($event)"]');

          this.headerList       = page.locator('table.table-condensed > thead > tr > th');

          this.buttonAppliquer  = page.locator('.pull-right > button');
                         
          //--------------------------------------------------------------------------------------------------------------
     }
}