/**
 * 
 * SOCIETES PAGE > MENU
 * 
 * @author Vazoumana Diarrassouba, JOSIAS SIE & JCC
 * @version 3.4
 * 
 */

import { TestFunctions } from "@helpers/functions";
import { Locator, Page } from "@playwright/test"

export class MenuSociete {

    public menu                             : any;
    public webService                       : any; 
    private onglets                         : any;
    private verboseMode                     : boolean;
    
    public readonly listBoxUser             : Locator
    public readonly linkDeconnexion         : Locator
    private readonly linkPages              : Locator

    private readonly fonction               : TestFunctions;

    constructor (page: Page, fonction:TestFunctions = null) {

        this.menu   = {
            accueil             : 0,
            lieuxVente          : 1,
            organisation        : 2,
            societes            : 3,
            clients             : 4,
            parametrage         : 5,
            admin               : 6
        }

        this.onglets = {

            //-----------------------Page admin------------------------

            admin: {
                administration           : page.locator('a.p-tabview-nav-link').nth(0),
                diffusion                : page.locator('a.p-tabview-nav-link').nth(1),
                communicationUtilisateurs: page.locator('a.p-tabview-nav-link').nth(2),
                changeLog                : page.locator('a.p-tabview-nav-link').nth(3)
            }
        };

        this.listBoxUser        = page.locator('#dropdownBasic1');
        this.linkDeconnexion    = page.locator('button.dropdown-item');
        this.linkPages          = page.locator('a.nav-link');

        this.fonction           = fonction;

        if (fonction !== null)  { 
            this.verboseMode        = fonction.isVerbose();
        } else {
            this.verboseMode        = false;
        }
        
    }

    //----------------------------------------------------------------------------------

    /**
     * 
     * Click sur le menu dénomé {pageName}
     * 
     * @param {string} pageName L'identifiant du menu
     * @param {Page}   page
     * 
    */
    public async click(pageName: string, page: Page, delay:number = 50000, verbose:boolean = this.verboseMode) {

        if (verbose) {
            console.log('');
            this.fonction.cartouche("-- Page : ",pageName);
        }

        if(typeof(this.menu[pageName]) == 'number'){
            await this.fonction.clickElement(this.linkPages.nth(this.menu[pageName]));
            this.fonction.checkTraductions(await this.linkPages.nth(this.menu[pageName]).textContent());
            await this.fonction.waitTillHTMLRendered(page, delay, verbose);
        } else {
            throw new Error('JCC : Elément du menu "' + pageName + '" inconnu')
        }

    }


    /**
     * 
     * @desc : Click sur l'onglet {ongletName} situé sur la page {pageName} 
     * @param {string} pageName      
     * @param {string} ongletName 
     * @param {Page}   page
    */
    public async clickOnglet(pageName: string, ongletName:string, page:Page, delay:number = 500000, verbose:boolean = this.verboseMode) {

        if (verbose) {
            console.log('');
            this.fonction.cartouche("-- Onglet : ",ongletName);
        }

        if (this.onglets[pageName][ongletName]) {
            await this.fonction.clickElement(this.onglets[pageName][ongletName]);
            this.fonction.checkTraductions(this.onglets[pageName][ongletName].textContent());
            await this.fonction.waitTillHTMLRendered(page, delay, verbose);
        } else {
            throw new Error('JCC : Onglet "' + ongletName + '" inconnu dans la page "' + pageName + '".')
        }
        
    } 

}