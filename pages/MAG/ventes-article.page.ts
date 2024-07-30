/**
 * Appli    : MAGASIN
 * Page     : VENTES
 * Onglet   : VENTES D'UNE JOURNEE
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * @since 14/09/2023
 * 
 */

import { Page} from '@playwright/test';

export class VentesArticle {

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonRechercher           = this.page.locator('[ng-click="rechercherVentes()"]');   

    public readonly datePickerVentesDu         = this.page.locator('#datepicker-date-ventes-debut i.icon-calendar');
    public readonly datePickerVentesAu         = this.page.locator('#datepicker-date-ventes-fin');

    public readonly pictoMoisPrecedent         = this.page.locator('div.datepicker th.prev').nth(0);

    public readonly tdActiveDays               = this.page.locator('td.day:NOT(.old)');

    public readonly inputArticle               = this.page.locator('[ng-item="autocomplete.article"]');
    public readonly inputPVCFrom               = this.page.locator('div.pvc > input').nth(0);
    public readonly inputPVCTo                 = this.page.locator('div.pvc > input').nth(1);

    public readonly dataGridListeVentes        = this.page.locator('.liste-ventes div.datagrid-table-wrapper > table > thead > tr > th'); 
    public readonly dataGridListeVentesLine    = this.page.locator('.liste-ventes .datagrid-liste-ventes  table  tbody tr')        

    public readonly autoCompleteArticle        = this.page.locator('li.gfit-autocomplete-result');

    public readonly labelTotalDesVentes        = this.page.locator('div.montant-ttc-ventes');

    constructor(public readonly page: Page) {}

}