/**
 * Appli    : MAGASIN
 * Menu     : COMMANDES
 * Onglet   : ENGAGEMENTS
 * 
 * @author JOSIAS SIE
 * @version 3.0
 * 
 */

import { Page} from '@playwright/test';

export class CommandesEngagements {

    public readonly buttonValider          = this.page.locator('[ng-click="valider()"]');  
    public readonly buttonEnvoyerAuCS      = this.page.locator('[ng-click="envoyer()"]');  

    public readonly listBoxEngagement      = this.page.locator('#select-engagement-filter');

    public readonly dataGridListesCmd      = this.page.locator('.liste-commandes th');
    public readonly dataGridEngagements    = this.page.locator('#dg-lignes-engagements');

    public readonly tdLibelleEngagement    = this.page.locator('td.datagrid-designation');
    public readonly tdStatutEngagement     = this.page.locator('td.datagrid-statut-designation');
    public readonly tdCodeArticle          = this.page.locator('td.datagrid-article-code');
    public readonly tdLibelleArticle       = this.page.locator('td.datagrid-article-designation');

    public readonly trLignesEngagements    = this.page.locator('.liste-commandes tbody tr'); 

    public readonly inputQuantiteEngagement= this.page.locator('td input.ng-valid');

    public readonly divMessageSuccess      = this.page.locator('div.gfit-success');

    constructor(public readonly page: Page) {};
}