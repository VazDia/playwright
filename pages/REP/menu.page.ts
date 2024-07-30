/**
 * 
 * REPARTITION PAGE > Menu
 * 
 * @author Vazoumana Diarrassouba & JOSIAS SIE 
 * @version 3.3
 * 
 */

import { Locator, Page, expect }                from "@playwright/test"

export class MenuRepartition {

    public menu                             : any;
    public onglets                          : any;

    public readonly listBoxPlateforme       : Locator  //(by.model('plateforme'));
    public readonly listBoxPlateformeItem   : Locator;
    public readonly listBoxRayon            : Locator  //(by.model('rayon'));
    public readonly listBoxGroupeArticle    : Locator  //(by.model('groupe'));
    public readonly listBoxUser             : Locator  //(by.css('.dropdown-toggle'));
    public readonly listBox

    public readonly tableRecapitulatif      : Locator

    public readonly linkDeconnexion         : Locator  //(by.css('[ng-click="deconnexionCliquee();"]'));    

    public readonly infoBulleNbRepart       : Locator  //(by.css('#IDnavbar3 > ul:nth-child(5) > li > a > span'));

    private verboseMode                     : boolean;
    private readonly fonction               : any;

    constructor (page: Page, fonction:any = null) {

        this.menu = {

            accueil       : '#IDnavbar3 .item0 a',
            lots          : '#IDnavbar3 .item1 a',
            articles      : '#IDnavbar3 .item2 a',
            repartition   : '#IDnavbar3 .item3 a',
            ordres        : '#IDnavbar3 .item4 a',
            referentiel   : '#IDnavbar3 .item5 a',
            admin         : '#IDnavbar3 .item6 a'
        }

        this.onglets = {

            //-----------------------Page articles------------------------
            articles: {
                articles                 : page.locator('a[href="#articles"]'),
                consignes                : page.locator('a[href="#consignes"]'),
                repartition              : page.locator('a[href="#repartitionsenerreur"]'),
                moyennes                 : page.locator('a[href="#moyennes"]')
            },

            //-----------------------Page ordres---------------------------
            ordres: {
                a_envoyer                : page.locator('a[href="#aenvoyer"]'),
                envoyes                  : page.locator('a[href="#envoye"]'),
                annules                  : page.locator('a[href="#annule"]')
            },

            //-----------------------Page referentiel-----------------------
            referentiel: {
                gestion                  : page.locator('a[href="#priorite"]'),
                groupes                  : page.locator('a[href="#groupes-magasins"]'),
                exception                : page.locator('a[href="#exception-repart"]'),
                repartition              : page.locator('a[href="#repartition-automatique"]')
            },

            //-----------------------Page admin------------------------------------
            admin: {
                administration           : page.locator('a[href="#administration"]'),
                verrous                  : page.locator('a[href="#verrous"]'),
                changelog                : page.locator('a[href="#changelog"]'),
                communicationUtilisateur : page.locator('a[href="#communicationUtilisateur"]')
            }
        } 

        this.listBoxPlateforme      = page.locator('[ng-model="plateforme"]');
        this.listBoxPlateformeItem  = page.locator('[ng-model="plateforme"] option');
        this.listBoxRayon           = page.locator('[ng-model="rayon"]');
        this.listBoxGroupeArticle   = page.locator('[ng-model="groupe"]');
        this.listBoxUser            = page.locator('.dropdown-toggle');

        this.tableRecapitulatif     = page.locator('#table-recapitulatif  thead tr th')

        this.linkDeconnexion        = page.locator('[ng-click="deconnexionCliquee();"]');    

        this.infoBulleNbRepart      = page.locator('#IDnavbar3 > ul:nth-child(5) > li > a > span');

        this.fonction               = fonction;

        if (fonction !== null)  { 
            this.verboseMode        = fonction.isVerbose();
        } else {
            this.verboseMode        = false;
        }
               
    }

    /**
     * 
     * Click sur l'onglet {ongletName} situé sur la page {pageName}
     * 
     * @param {string} pageName L'identifiant du menu     
     * @param {string} ongletName L'identifiant de l'Onglet
     * @param {Page} page
     * 
     */

    public async clickOnglet(pageName:string, ongletName:string, page:Page, delay:number = 500000, verbose:boolean = this.verboseMode){

        if (verbose) {
            console.log('');
            this.fonction.cartouche("-- Onglet : ",ongletName);
        }

        if (this.onglets[pageName][ongletName]) {
            await this.fonction.clickElement(this.onglets[pageName][ongletName]);
            this.fonction.checkTraductions(this.onglets[pageName][ongletName].textContent());
          await this.fonction.waitTillHTMLRendered(page, delay, verbose);
        } else {
            throw new Error('NotFoundError : Onglet "' + ongletName + '" inconnu dans la page "' + pageName + '".')
        }
    }

    /**
     * 
     * Click sur le bouton {cible} du menu
     * 
     * @param {string} cible L'identifiant du menu
     * @param {Page} page
     * 
     */

    public async click(cible: string, page: Page, delay:number = 500000, verbose:boolean = this.verboseMode) {        

        if (verbose) {
            console.log('');
            this.fonction.cartouche("-- Page : ",cible);
        }

        if (typeof(this.menu[cible]) === 'string' )
        {  
            var target = page.locator(this.menu[cible]);
            await expect(target).toBeEnabled();
            await target.click();
            await this.fonction.waitTillHTMLRendered(page, delay, verbose);
        } else {
            throw new Error('Ooops : Elément du menu "' + cible + '" inconnu');
        }
    }
        
    /**
     * 
     * Sélectionne la plateforme (Liste déroulante située dans le menu)
     * 
     * @param {string(3)} idPlateforme 
     */

    public async selectPlateforme (idPlateforme: string, page:Page) {
        await this.listBoxPlateforme.selectOption({label: idPlateforme});
        await this.fonction.waitTillHTMLRendered(page, 30000, false);
    }

    /**
     * 
     * Sélectionne le rayon (Liste déroulante située dans le menu)
     * 
     * @param {string(2)} idRayon  L'identifiant du rayon 
     * @param {string} delay  Le delai d'attente
     */

    public async selectRayon(idRayon: string, page:Page, delay:number = 30000) {
        await this.listBoxRayon.click();
        await this.listBoxRayon.selectOption({label: idRayon});
        await this.listBoxRayon.click();
        await this.fonction.waitTillHTMLRendered(page, delay, false);
    } 

    /**
     * 
     * Sélectionne le rayon (Liste déroulante située dans le menu)
     * 
     * @param {string} sRayon 
     */

    public async selectRayonByName (sRayon: string, page:Page) {
        var clickable = await this.listBoxRayon.isEnabled();
        if (clickable) {
            await page.locator('rayon').click();
            await page.locator('rayon').selectOption({label: sRayon});
            await page.locator('rayon').click();
            await this.fonction.waitTillHTMLRendered(page, 30000, false);
        }
    }
    
    /**
     * 
     * Sélectionne la Plateforme (Liste déroulante située dans le menu)
     * 
     * @param {string} sPlateforme 
     */

    public async selectPlateformeByName (sPlateforme: string, page:Page) {
        var clickable = await this.listBoxPlateforme.isEnabled();
        if (clickable) { 
            await page.locator('plateforme').click();
            await page.locator('plateforme').selectOption({label: sPlateforme});
            await page.locator('plateforme').click();
            await this.fonction.waitTillHTMLRendered(page, 30000, false);
        }
    }

    /**
     * 
     * Sélectionne le groupe article (Liste déroulante située dans le menu)
     * 
     * @param {string(2)} sGroupeArticle 
     */

    public async selectGroupeArticleByName(sGroupeArticle: string, page:Page) {
        await this.listBoxGroupeArticle.selectOption({label:sGroupeArticle });
        await this.fonction.waitTillHTMLRendered(page, 30000, false);
    } 

    /**
     * 
     * Sélectionne la plateforme (Liste déroulante située dans le menu)
     * 
     * @param {string(3)} idPlateforme 
     */
    
    public async selectPlateforrme(idPlateforme: string, page: Page) {
        await this.listBoxPlateforme.selectOption({label: idPlateforme });
        await this.fonction.waitTillHTMLRendered(page, 30000, false);
    }
}