/**
 * Appli    : STOCK
 * Menu     : REFERENTIEL
 * Onglet   : ARTICLES
 * 
 * author JOSIAS SIE
 * 
 * @version 3.0
 * 
 */

import { Page }          from "@playwright/test";

export class ReferentielArticles {

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonEnregistrer          = this.page.locator('[ng-click="enregistrerDetail()"]');

    public readonly inputFiltreArticle         = this.page.locator('input.filter-input');
    //public readonly inputEmplacement           = this.page.locator('#input-emplacement');
    public readonly inputEmplacementReception  = this.page.locator('#emplacement-reception');
    public readonly inputSeuilRotation         = this.page.locator('#seuil-rotation');

    public readonly inputPlateForme            = this.page.locator('input.filter-input').nth(0);
    public readonly inputGroupeArticle         = this.page.locator('input.filter-input').nth(1);
    public readonly buttonEnregistrerParam     = this.page.locator('[ng-click="enregistrer()"]');

    public readonly dataGridReferentiel        = this.page.locator('.tab-pane div.datagrid-table-wrapper > table > thead > tr > th');
    public readonly dataGridParametreGArticle  = this.page.locator('table.table-condensed thead th');

    public readonly listBoxGroupeArticle       = this.page.locator('#select-groupe-article');

    public readonly checkBoxArticles           = this.page.locator('.parametres-articles td input');

    public readonly toggleButtonClassique      = this.page.locator('[ng-click="switchTypeEtiquette(false)"]');
    public readonly toggleButtonReduite        = this.page.locator('[ng-click="switchTypeEtiquette(true)"]');

    //----------------------------------------------------------------------------------------------------------------    
    constructor(public readonly page: Page) {}  
}