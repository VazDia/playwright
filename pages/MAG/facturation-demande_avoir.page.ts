/**
 * Appli    : MAGASIN
 * Page     : FACTURATION
 * Onglet   : DEMANDE D'AVOIR
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * 
 */
import { Page} from '@playwright/test';

export class FaturationDemandeAvoir {

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonCreer                = this.page.locator('div.demandes-avoir div.form-btn-section button i.fa-plus');   
    public readonly buttonVoirPhotos           = this.page.locator('div.demandes-avoir div.form-btn-section button i.fa-camera');   

    public readonly datePickerPeriode          = this.page.locator('p-calendar#periode'); 

    public readonly inputFiltreCodeArticle     = this.page.locator('p-table th input.p-component').nth(0);
    public readonly inputFiltreArticle         = this.page.locator('p-table th input.p-component').nth(1);
    public readonly inputFiltreConditionnement = this.page.locator('p-table th input.p-component').nth(2);

    public readonly dataGridListeArticles      = this.page.locator('p-table tr:nth-child(1) th');  
    
    public readonly dataGridListeCodes         = this.page.locator('td.datagrid-article-code');
    public readonly dataGridListeMotifs        = this.page.locator('td.datagrid-motif');
    
    
    //-- POPIN : Création d'une demande d'avoir ----------------------------------------------------------------------

    public readonly pPlistBoxGroupeArticle     = this.page.locator('select[ng-model="groupeArticle"]');
    public readonly pPlistBoxTypeDAV           = this.page.locator('#type');
    public readonly pPlistBoxMotifDAV          = this.page.locator('select[ng-model="motif"]');

    public readonly pPinputArticle             = this.page.locator('input[ng-model="autoCompleteArticle.display"]');

    public readonly pPdatePickerLivraison      = this.page.locator('#date-livraison');

    public readonly pPbuttonRechercherBLDef    = this.page.locator('#recherche-bl-demande-avoir');
    public readonly pPbuttonAjouter            = this.page.locator('[ng-click="calculQteManquante()"]');
    public readonly pPbuttonEnregistrer        = this.page.locator('div.modal.hide.in > div.modal-footer > button');
    public readonly pPbuttonFermer             = this.page.locator('div.modal.hide.in > div.modal-footer > a');    

    public readonly pPinputQuantiteDemandee    = this.page.locator('#quantite');

    public readonly pPtextAreaObservations     = this.page.locator('#obs');

    public readonly pPdataGridListeDAV         = this.page.locator('.lignes-avoir th');

    constructor(public readonly page: Page) {};
}