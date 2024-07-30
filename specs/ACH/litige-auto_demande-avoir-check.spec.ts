/**
 * 
 * @author SIAKA KONE
 * @since 2024-07-15
 * 
 */
const xRefTest      = "4.1.2 ACH_LIT_TRT2";
const xDescription  = "Traiter automatiquement un litige (batch OPCON)";
const xIdTest       =  236;
const xVersion      = "3.0";

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['rayon','listeArticles','fournisseur','plateformeReception'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page, expect }   from '@playwright/test';

import { Help }             from '@helpers/helpers.js';
import { TestFunctions }    from '@helpers/functions.js';
import { Log }              from '@helpers/log.js';
import { MenuAchats }       from '@pom/ACH/menu.page.js';
import { PageLitLitAut }    from '@pom/ACH/litiges_litiges-automatiques.page.js';
import { PageLitDemAvo }    from '@pom/ACH/litiges_demandes-avoir.page.js';

import { CartoucheInfo }    from '@commun/types';

//------------------------------------------------------------------------------------

let page            : Page;
var pageLitAuto     : PageLitLitAut;
var pageLitDem      : PageLitDemAvo;
var menu            : MenuAchats;

const log           = new Log();
const fonction      = new TestFunctions(log);

//------------------------------------------------------------------------------------
fonction.importJdd();
//------------------------------------------------------------------------------------

const sRayon            = fonction.getInitParam('rayon', 'Fruits et légumes');
const sCodeArticles     = fonction.getInitParam('listeArticles','8494');
const sFournisseur      = fonction.getInitParam('fournisseur','FRUIDOR LYON');
const sPlateformeRecep  = fonction.getInitParam('plateformeReception','Chaponnay');

const nomFichier        = process.env.E2E || 'E2E_FL_LIT';

const oDataVeille       = require('_data/_tmp/' + fonction.getPrefixeEnvironnement() + '_' + nomFichier + '-' + fonction.getToday('us', -1) + '.json');

const sDateAuF:string   = fonction.getToday('FR', 0 ,' / ');
const sNumLot:string    = oDataVeille.aLots[sCodeArticles];
//------------------------------------------------------------------------------------
 
test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage();
    menu            = new MenuAchats(page, fonction);    
    pageLitAuto     = new PageLitLitAut(page);
    pageLitDem      = new PageLitDemAvo(page);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
})
 
test.afterAll(async() => {
    await fonction.close();
})

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

    test('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test('Connexion', async() => {
       await fonction.connexion(page);
    })
  
    test.describe('Page [LITIGES]', async() => {

        var sPageName:string = 'litiges';

        test('ListBox [RAYON] = "' + sRayon + '"', async() => {
            await menu.selectRayonByName(sRayon, page);
        })

        test("Menu [LITIGES] - Click ", async () => {
            await menu.click(sPageName, page);
            const dateArrire = fonction.getToday('FR', -7, ' / ');
            log.set('Date à moins : ' + dateArrire);
        })

        test.describe ('Onglet [DEMANDE D\'AVOIR]', async() => {

            test('Onglet DEMANDE D\'AVOIR] - Click', async () => {
                await menu.clickOnglet(sPageName, 'demandeAvoir', page);
            })

            test('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);   // Par défaut, aucune erreur remontée au chargement de l'onglet / la page / la popin
            })

            const sDateDuP:string = fonction.getToday('FR', -7, ' / ');
            test('Check [DU JJ - 7] = "' + sDateDuP + '"', async () => {
                const sDateDu:string = await pageLitDem.inputFieldDateDebut.inputValue();
                expect(sDateDu).toBe(sDateDuP);
            })

            test('Check [AU JJ] = "' + sDateAuF + '"', async () => {
                const sDateAu:string = await pageLitDem.inputFieldDateFin.inputValue();
                expect(sDateAu).toBe(sDateAuF);
            })

            test ('CheckBox [AFFICHER AUSSI LES DEMANDES TRAITES] - Click', async () => {
                await fonction.clickElement(pageLitDem.checkBoxToutAfficher);
            })

            test('InputField [LOT] = "' + sNumLot + '"', async () => {        
                await fonction.sendKeys(pageLitAuto.inputFieldLot, sNumLot.trim());
            })

            test('Check [DATE DEMANDE AVOIR] = "' + sDateAuF + '"', async () => {
                const sDateJour:string = await pageLitDem.tdDateDemandeAvoir.first().textContent();
                expect(sDateJour).toBe(sDateAuF);
                log.set('Date jour : ' + sDateJour);
            })

            test('Check [PLATEFORME RECEPTION] = "' + sPlateformeRecep + '"', async () => {
                const sPlateformeRecept = await pageLitDem.tdPlateformeReception.first().textContent();
                expect(sPlateformeRecept).toBe(sPlateformeRecep);
                log.set('Plateforme reception : ' + sPlateformeRecept);
            })

            test('Check [NUM LOT][0] = "' + sNumLot + '"', async () => {        
                await fonction.wait(page, 1000);    //-- Attente raffraîchissement page
                const sNumDemAvoir = await pageLitDem.tdNumDemandeAvoir.first().textContent();
                log.set('Numéro de demande d\'avoir générée : ' + sNumDemAvoir);
                expect(await pageLitDem.tdNumLot.first().textContent()).toBe(sNumLot);
            })

            test('Check [CODE ARTICLE] = "' + sCodeArticles + '"', async () => {
                const sCodeArticle:string = await pageLitDem.tdCodeArticle.first().textContent();
                expect(sCodeArticle).toBe(sCodeArticles);
            })

            const sDesignaytionArticle:string = 'Banane Des Antilles';
            test('Check [DESIGNATION ARTICLE] = "' + sDesignaytionArticle + '"', async () => {
                const sDesignArticle:string = await pageLitDem.tdDesignationArticle.first().textContent();
                expect(sDesignArticle).toBe(sDesignaytionArticle);
            })

            const sCodeFournisseur:string = '00015';
            test('Check [CODE FOURNISSEUR] = "' + sCodeFournisseur + '"', async () => {
                const sCodeFourn:string = await pageLitDem.tdCodeFournisseur.first().textContent();
                expect(sCodeFourn).toContain(sCodeFournisseur);
            })

            test('Check [FOURNISSEUR] = "' + sFournisseur + '"', async () => {
                const sFourn:string = await pageLitDem.tdDesignFournisseur.first().textContent();
                expect(sFourn).toBe(sFournisseur);
            })

            const sMont:string = '11.200';
            test('Check [MONTANT] = "' + sMont + '"', async () => {
                const sMontant:string = await pageLitDem.tdMontant.first().textContent();
                expect(sMontant).toContain(sMont);
            })

            const sQteLitige:string = '10';
            test('Check [QUANTITE LITIGE] = "' + sQteLitige + '"', async () => {
                const sNbreColis:string = await pageLitDem.tdQteLitige.first().textContent();
                expect(sNbreColis).toBe(sQteLitige);
            })

            const sType:string = 'Quantité';
            test('Check [TYPE] = "' + sType + '"', async () => {
                const sTypeLit:string = await pageLitDem.tdType.first().textContent();
                expect(sTypeLit).toBe(sType);
            })

            const sRaisonExcepte:string = "Colis manquants à l'arrivage";
            test('Check [RAISON] = "' + sRaisonExcepte + '"', async () => {
                const sRaison:string = await pageLitDem.tdRaison.first().textContent();
                expect(sRaison).toBe(sRaisonExcepte);
            })

            const sStatutExcepte:string = 'Approuvée';
            test('Check [STATUT] = "' + sStatutExcepte + '"', async () => {
                const sStatut = await pageLitDem.tdStatut.first().textContent();
                expect(sStatut).toBe(sStatutExcepte);
            })

            const sBlConcerne:string = 'TA_BL';
            test('Check [BL CONCERNES] = "' + sBlConcerne + '"', async () => {
                const sBl = await pageLitDem.tdBlConcernes.first().textContent();
                expect(sBl).toContain(sBlConcerne);
            })
        })  // End  Onglet
      
    })  // End  Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    })

})  // End describe