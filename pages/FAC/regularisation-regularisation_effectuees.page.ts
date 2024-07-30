/**
 * 
 * FACTURATION PAGE > MENU
 * 
 * @author Vazoumana Diarrassouba
 * @version 1.0
 * 
 */

import { Locator, Page, test } from "@playwright/test"

export class RegularisationRegularisationEffectuee {

    public readonly buttonCreerLitigesFourn                             : Locator
    public readonly buttonFacturerLesRegul                              : Locator
    public readonly buttonCloturerPeriode                               : Locator
    public readonly buttonRechercher                                    : Locator

    public readonly inputSearchMDestinataire                            : Locator
    public readonly inputSearchArticle                                  : Locator
    public readonly inputSearchlot                                      : Locator     
    
    public readonly dataGridRegularisations                             : Locator
    public readonly dataGridRecapitulatif                               : Locator  

    //-- Popin : Envoyer les factures de régularisation -----------------------------------------------------------------
    public readonly pButtonFacturer                                     : Locator        
    public readonly pButtonFermer                                       : Locator        

    public readonly pDatePickerDateDemande                              :Locator

    //-- Popin : Confirmation de clôture de période ---------------------------------------------------------------------
    public readonly pButtonOui                                          :Locator
    public readonly pButtonFermerCloture                                :Locator
    public readonly pDatePickerDateFinPeriode                           :Locator

    constructor(page:Page){
        
        this.buttonCreerLitigesFourn                                    = page.locator('[ng-click="envoyerLitiges()"]');
        this.buttonFacturerLesRegul                                     = page.locator('[ng-click="popupFacturation.open = true;"]');
        this.buttonCloturerPeriode                                      = page.locator('[ng-click="popupCloture.open = true;"]');
        this.buttonRechercher                                           = page.locator('[ng-click="rechercherRegularisations()"]');    

        this.inputSearchMDestinataire                                   = page.locator('[ng-model="autocomplete.display"]');
        this.inputSearchArticle                                         = page.locator('[ng-model="filters.article"]').locator('[ng-model="ngModel"]');
        this.inputSearchlot                                             = page.locator('[ng-model="filters.lot"]').locator('[ng-model="ngModel"]');       
        
        this.dataGridRegularisations                                    = page.locator('.datagrid-table-wrapper > table > thead > tr > th');  
        this.dataGridRecapitulatif                                      = page.locator('table.table-recapitulatif > thead > tr > th');   

        //-- Popin : Envoyer les factures de régularisation -----------------------------------------------------------------
        this.pButtonFacturer                                            = page.locator('div.modal.hide.in > div.modal-footer > button');
        this.pButtonFermer                                              = page.locator('div.modal.hide.in > div.modal-footer > a');

        this.pDatePickerDateDemande                                     = page.locator('[ng-model="formattedDate"]');

        //-- Popin : Confirmation de clôture de période ---------------------------------------------------------------------
        this.pButtonOui                                                 = page.locator('div.modal.hide.in > div.modal-footer > button');
        this.pButtonFermerCloture                                       = page.locator('div.modal.hide.in > div.modal-footer > a');

        this.pDatePickerDateFinPeriode                                  = page.locator('input.dateFinPeriode');
    }
}