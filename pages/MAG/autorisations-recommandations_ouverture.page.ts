/**
 * Appli    : MAGASIN
 * Page     : AUTORISATIONS
 * Onglet   : RECOMMANDATIONS D'OUVERTURE
 * 
 * @author  JC CALVIERA
 * @version 3.0
 * @since   2024-03-20
 * 
 */
import { Page} from '@playwright/test';

export class AutorisationsRecomOuverture {

    public readonly buttonEnregistrer               = this.page.locator('div.form-btn-section button:nth-child(1)');    

    public readonly dataGridListeRecom              = this.page.locator('div[ng-controller="RecommandationsOuvertureControleur"] table tr:nth-child(1) th');
    public readonly dataGridListeRecomSub           = this.page.locator('div[ng-controller="RecommandationsOuvertureControleur"] table th.th-type-critere'); //sub-headers
    public readonly dataGridListeRecomElements      = this.page.locator('div[ng-controller="RecommandationsOuvertureControleur"] table tbody tr');

    public readonly listBoxGroupeArticle            = this.page.locator('p-dropdown[id="groupe-article-select"]');
    public readonly listBoxChoixGroupeArticle       = this.page.locator('p-dropdownitem li span');

    public readonly multiSelectDossierAchat         = this.page.locator('p-multiselect[id="dossier-achat-select"]'); 

    //--

    constructor(public readonly page: Page) {};
    
}