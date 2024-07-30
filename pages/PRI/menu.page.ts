/**
 * 
 * PRICING PAGE > MENU
 * 
 * @author Vazoumana Diarrassouba
 * @version 2.0
 * 
 */

import { TestFunctions } from "@helpers/functions";
import { Locator, Page } from "@playwright/test"

export class MenuPricing {

    private readonly menu                   : any;
    public readonly onglets                 : any;
    public readonly page                    : Page;
    private verboseMode                     : boolean;

    public readonly listBoxRayon            : Locator;
    public readonly listBoxUser             : Locator;
    public readonly linkDeconnexion         : Locator;

    private readonly fonction               : TestFunctions;

    constructor (page: Page, fonction:TestFunctions = null) {

        this.menu = {
            accueil         :'#main-navbar .item0 a',
            tarification    :'#main-navbar .item1 a',
            alignements     :'#main-navbar .item2 a',
            gestion         :'#main-navbar .item3 a',
            strategies      :'#main-navbar .item4 a',
            admin           :'#main-navbar .item6 a'
        };

        this.onglets = {
            tarification    : {
                tarification                : page.locator('a[href="#tarification"]'),
                simulationPrix              : page.locator('a[href="#simulation"]'),
            },
            admin           : {
                administration              : page.locator('a[role="tab"]').nth(0),
                communicationUtilisateurs   : page.locator('a[role="tab"]').nth(1),
                changelog                   : page.locator('a[role="tab"]').nth(2),
                parametrages                : page.locator('a[role="tab"]').nth(3)
            }
        };

        this.listBoxRayon       = page.locator('[ng-model="rayon"]');
        this.listBoxUser        = page.locator('.dropdown-toggle');
        this.linkDeconnexion    = page.locator('[ng-click="deconnexion();"]');
        this.fonction           = fonction;

        if (fonction !== null)  { 
            this.verboseMode    = fonction.isVerbose();
        } else {
            this.verboseMode    = false;
        }

    }

    /**
     * 
     * @param {string} cible L'identifiant du menu
     * @param {Page} page
     * @description Click sur le bouton {cible} du menu
     * 
     */
    public async click(cible: string, page: Page) {     

        if (this.verboseMode) {
            console.log('');
            this.fonction.cartouche("-- Page : ",cible);
        }

        if (typeof(this.menu[cible]) === 'string' ) {  
            await page.locator(this.menu[cible]).click();
            await this.fonction.waitTillHTMLRendered(page, 50000, this.verboseMode);
        } else {
            throw new Error('TypeError: Elément du menu "' + cible + '" inconnu');
        }
    } 

    
    /**
    *  
    * @param {string} pageName    
    * @param {string} ongletName 
    * @description Click sur l'onglet {ongletName} situé sur la page {pageName}
    * 
    */
    public async clickOnglet(pageName: string, ongletName: string, page: Page, delay:number = 500000, verbose:boolean = this.verboseMode){

        if (verbose) {
            console.log('');
            this.fonction.cartouche("-- Onglet : ",ongletName);
        }
        try{  
            await this.fonction.clickElement(this.onglets[pageName][ongletName]);
            await this.fonction.checkTraductions(await this.onglets[pageName][ongletName].textContent());            
            await this.fonction.waitTillHTMLRendered(page, delay, verbose);
        } catch(erreor) {
            throw new Error('Ooops : Onglet "' + ongletName + '" inconnu dans la page "' + pageName + '".')
        }

    }
    
    /**
     * 
     * @param sRayon Le libellé du rayon
     * @param page 
     * @description Sélectionne le rayon via la liste déroulante située dans le menu
     */
    public async selectRayonByName(sRayon:string, page:Page) {
        await this.listBoxRayon.selectOption({label:sRayon});
        await this.fonction.waitTillHTMLRendered(page, 30000);
    }

}