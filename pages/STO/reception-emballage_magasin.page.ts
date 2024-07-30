/**
 * Appli    : STOCK
 * Page     : EMBALLAGE
 * Onglet   : RECEPTION
 * 
 * @author JOSIAS SIE
 * 
 * @version 3.0
 * 
 */

import { Page }          from "@playwright/test";

export class ReceptionEmballageMagasin {

    //---------------------------------------------------------------------------------------------------------------- 

    public readonly buttonCreer                 = this.page.locator('.form-btn-section button').nth(0);
    public readonly buttonModfier               = this.page.locator('.form-btn-section button').nth(1);
    public readonly buttonAnnuler               = this.page.locator('.form-btn-section button').nth(2);
    public readonly buttonVisualiser            = this.page.locator('.form-btn-section button').nth(3);
    public readonly buttonImprimer              = this.page.locator('.form-btn-section button').nth(4);
    public readonly checkboxListeReception      = this.page.locator('p-tablecheckbox div[role="checkbox"]');
    public readonly tdFiltreNumeroBl            = this.page.locator('#filtre-numeroBL input');
    public readonly tdFiltreTransporteur        = this.page.locator('#filtre-transporteur input');
    public readonly tdFiltreReceptionnaire      = this.page.locator('#filtre-receptionnaire input');

    public readonly spanNumeroBl               = this.page.locator('tbody > tr .colonne-numeroBL span');
    public readonly spanTransporteur           = this.page.locator('tbody > tr .colonne-transporteur span');
    public readonly spanReceptionnaire         = this.page.locator('tbody > tr .colonne-receptionnaire span');

    public readonly  buttonDatepicker          = this.page.locator('.p-datepicker-trigger .pi-calendar');
    public readonly  tdDatepickerToday         = this.page.locator('td.p-datepicker-today');

    //-- Popin : Création d'une réception d'emballage ------------------------------------------------------------------------------
    public readonly pInputChauffeur             = this.page.locator('#chauffeur');
    public readonly pAutocompleteExpediteur     = this.page.locator('input#recherche-expediteur');
    public readonly pAutocompleteTransporteur   = this.page.locator('input#transporteur');
    public readonly pInputNumeroBl              = this.page.locator('input#numero-bl');
    public readonly pInputReceptionnaire        = this.page.locator('input#receptionnaire');
    public readonly pButtonQuantite             = this.page.locator('.input-icon-container .sigale-button em.icon-plus');
    public readonly pEmQuantite                 = this.page.locator('.input-icon-container .sigale-button em.icon-minus');
    public readonly pButtonEnregistrer          = this.page.locator('button#enregistrer');
    public readonly pButtonTerminer             = this.page.locator('button#terminer');
    public readonly pButtonAnnuler              = this.page.locator('button.btn-link');
    public readonly spanStatutReception         = this.page.locator('tbody .colonne-statut span');

    //-- Popin : Annulation d'une réception d'emballages---------------------------------------------------------------------------- 
    public readonly pButtonConfirmer            = this.page.locator('.p-dialog-footer button.p-confirm-dialog-accept');
     
    constructor(public readonly page: Page) {}   
}