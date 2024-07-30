/**
 * Appli    : MAGASIN
 * Page     : STOCK
 * Onglet   : MODIFIER INVENTAIRE
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * 
 */

import { Page} from '@playwright/test';


export class StockHistorique {

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonModifierInventaire   = this.page.locator('[ng-click="corrigerInventaire()"]');   
    public readonly buttonImprimerEcartsInv    = this.page.locator('[ng-click="imprimerEcartInventaire(inventaireSelectionne.id)"]');

    public readonly datePickerInventaireFrom   = this.page.locator('#datepicker-from > input');          
    public readonly datePickerInventaireTo     = this.page.locator('#datepicker-to > input');          
    public readonly datePickerLinkPrev         = this.page.locator('div.datepicker-days > table > thead > tr > th.prev');                        // bouton mois précédent du calendrier
    public readonly datePickerFirstDay         = this.page.locator('div.datepicker-days > table > tbody > tr:nth-child(1) > td:nth-child(1)');   // premier jour du calendrier    

    public readonly inputGrpArticle            = this.page.locator('.filtre-groupe-article-ou-zone-input input');
    public readonly inputFiltreArticle         = this.page.locator('.filtre-articles-input input');

    public readonly dataGridInventaires        = this.page.locator('.liste-inventaires th');    
    public readonly dataGridHistorique         = this.page.locator('.lignes-inventaire th');    

    public readonly tdListeInventaires         = this.page.locator('td.datagrid-designationGroupeArticleOuZone');
    public readonly tdListeDatesInventaires    = this.page.locator('td.datagrid-dateInventaire');
    public readonly tdListeDatesValidInventaire= this.page.locator('td.datagrid-dateDerniereValidation');

    public readonly thHeaderDatesInventaires   = this.page.locator('th.datagrid-dateInventaire');

    
    constructor(public readonly page: Page) {};

}