/**
 * Page     : STOCK 
 * Menu     : STOCK
 * Onglet   : HISTORIQUE DES MOUVEMENTS
 * 
 * author JC CALVIERA
 * 
 * @version 3.0
 * 
 * @param Functions Test (fonctions génériques)
 * 
 */

import { Page }          from "@playwright/test";

export class StockMouvements{

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly buttonAfficherMvt          = this.page.locator('[ng-click="afficherMouvementsLot(dg.selection[0])"]');
    public readonly buttonRechercher           = this.page.locator('[ng-click="rechercherLot()"]');    

    public readonly inputFiltreNumLot          = this.page.locator('#recherche-lot');
    public readonly inputFiltreArticle         = this.page.locator('#recherche-article');    

    public readonly datePickerReceptionFrom    = this.page.locator('#input-start-date');
    public readonly datePickerReceptionTo      = this.page.locator('#input-end-date');

    public readonly dataGridLots               = this.page.locator('div.mouvements-recherche-lot-resultats thead th');
    
    //----------------------------------------------------------------------------------------------------------------    
    constructor(public readonly page: Page) {} 
}