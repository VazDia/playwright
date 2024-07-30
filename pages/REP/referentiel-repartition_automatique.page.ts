/**
 * 
 * REPARTITION PAGE > REFERENTIEL / ONGLET > REPARTITION AUTOMATIQUE
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * @since 2024-06-13
 */

import { Page } from "@playwright/test"

export class RefRepartitionAutoPage {

     public readonly buttonCreer              = this.page.locator('.repartition-automatique.form-btn-section em.icon-plus-sign');
     public readonly buttonModifier           = this.page.locator('.repartition-automatique.form-btn-section em.pi-pencil');  
     public readonly buttonActiver            = this.page.locator('.repartition-automatique.form-btn-section .pi-check'); 
     public readonly buttonDesactiver         = this.page.locator('.repartition-automatique.form-btn-section em.pi-ban'); 
     public readonly buttonSupprimer          = this.page.locator('.repartition-automatique.form-btn-section em.pi-trash'); 
     public readonly pButtonFermer            = this.page.locator('p-footer .btn-link');
     public readonly dataGridGroupeArticle    = this.page.locator('table .first-line th');
               
     //-- Popin : Création d'un paramétrage de répartition automatique ------------------------------------------------------

     public readonly pInputGroupeArticle      = this.page.locator('p-dropdown[formcontrolname="groupeArticle"]'); 
     public readonly pInputGestionRupture     = this.page.locator('p-dropdown[formcontrolname="gestionRupture"]');
     public readonly pInputFamille            = this.page.locator('app-autocomplete[formcontrolname="famille"]');
     public readonly pInputSousFamille        = this.page.locator('app-autocomplete[formcontrolname="sousFamille"]');
     public readonly pInputDerniereSousFamille= this.page.locator('app-autocomplete[formcontrolname="derniereSousFamille"]');
     public readonly pInputArticle            = this.page.locator('app-autocomplete[formcontrolname="article"]');
     public readonly pInputswitchAutoriser    = this.page.locator('p-inputswitch span.p-inputswitch-slider').nth(0);
     public readonly pInputswitchRepartir     = this.page.locator('p-inputswitch span.p-inputswitch-slider').nth(1);
     public readonly pInputswitchRepartirLots = this.page.locator('p-inputswitch span.p-inputswitch-slider').nth(2);
     public readonly pInputswitchTerminer     = this.page.locator('p-inputswitch span.p-inputswitch-slider').nth(3);
     
     constructor(public readonly page: Page) {};
}