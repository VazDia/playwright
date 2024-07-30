/**
 * Appli    : STOCK
 * Page     : STOCK
 * Onglet   : SITUATION DES PALETTES
 * 
 * author JOSIAS SIE 
 * 
 * @version 3.0
 * 
 */

import { Page }          from "@playwright/test";

export class StockSituation{

    //----------------------------------------------------------------------------------------------------------------    
    
    public readonly inputPalette               = this.page.locator('span[ng-model="numeroPalette"]').locator('input').nth(0);
    public readonly inputNumLot                = this.page.locator('span[ng-model="numeroLot"]').locator('input').nth(0);
    public readonly inputArticle               = this.page.locator('#recherche-article');
    public readonly inputAll                   = this.page.locator('.sigale-input-container input');

    public readonly checkBoxListePalettes      = this.page.locator('.situation-palettes-resultats td input');

    public readonly toggleManquante            = this.page.locator('[ng-click="switchEtat(\'MANQUANTE\')"]');
    public readonly toggleBloquee              = this.page.locator('[ng-click="switchEtat(\'BLOQUEE\')"]');

    public readonly buttonRechercher           = this.page.locator('[ng-click="loadSituationPalettes()"]');
    public readonly buttonAfficherDeplacement  = this.page.locator('[ng-click="afficherMouvementsPalette(dgSituationPalette.selection[0])"]');
    public readonly buttonRechercherLot        = this.page.locator('button[title="Rechercher"]');

    public readonly tdQuantiteLot              = this.page.locator('tbody tr td.datagrid-nbColisEnStock span');

    public readonly dataGridListePalettes      = this.page.locator('.situation-palettes-resultats th');

    public readonly autoCompleteArticle        = this.page.locator('.gfit-autocomplete-results li');

    //-- Popin : Historique des mouvements de la palette {NumPalette} ------------------------------------------------
    public readonly pToggleDeplacement         = this.page.locator('[ng-click="switchMouvement(\'DEPLACEMENT\')"]');
    public readonly pToggleMouvement           = this.page.locator('[ng-click="switchMouvement(\'MOUVEMENT\')"]');

    public readonly pDataGridMvtPalettes       = this.page.locator('.mouvements-palette th');

    public readonly pLinkFermer                = this.page.locator('.modal-mouvements-palette .modal-footer a');

    //----------------------------------------------------------------------------------------------------------------    
    constructor(public readonly page: Page) {}  
}