/**
 * 
 * @desc Annulation d'un bon de restitution
 * 
 * @author JC CALVIERA
 *  Since 2024-01-16
 */

const xRefTest      = "STO_EMB_ABR";
const xDescription  = "Annulation d'un bon de restitution";
const xIdTest       =  1565;
const xVersion      = '3.0';

var info = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['plateforme'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page, expect}   from '@playwright/test';

import { TestFunctions }            from "@helpers/functions";
import { Log }                      from "@helpers/log";
import { Help }                     from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuStock }                from "@pom/STO/menu.page";
import { EmballageRestitution }     from '@pom/STO/emballage-restitution.page';

//----------------------------------------------------------------------------------------

let page            : Page;

let menu            : MenuStock;
let pageEmballage   : EmballageRestitution;

const log           = new Log();
const fonction      = new TestFunctions(log);

//----------------------------------------------------------------------------------------

const sPlateforme   = process.env.PLATEFORME || 'Chaponnay';

//------------------------------------------------------------------------------------   

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
    page            = await browser.newPage(); 

    menu            = new MenuStock(page, fonction);
    pageEmballage   = new EmballageRestitution(page);
})

test.afterAll(async () => {
    await fonction.close();
})

//------------------------------------------------------------------------------------

test.describe ('[' + xRefTest + ']', () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    })

    test('Ouverture URL', async() => {
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
    })

    test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async() => {            
        await menu.selectPlateforrme(page, sPlateforme);                       // Sélection d'une plateforme par défaut
    })

    test.describe('Page [EMBALLAGE]', async () =>  {  

        var currentPage = 'emballage';
        var sNumCommande: string | null = null;

        test('Page [EMBALLAGE] - Click', async () => {
            await menu.click(currentPage, page);  
        })
             
        test('Label [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);                     
        })

        test.describe('Onglet [LIVRAISON]', async () =>  {        
            
            test('Onglet [LIVRAISON] - Click', async () =>  {
                await menu.clickOnglet(currentPage, 'livraison', page);                                         
            })   
      
            test('Toggle Button [ANNULE] - Click', async () =>  {
                //-- On déclique afin que seul les enregistrements avec le statut "Créé" soient affcihés
                await fonction.clickAndWait(pageEmballage.toggleAnnule, page, 40000);
                await fonction.wait(page, 500);         // Attente mise à jour contenu page coté client
            })

            test('DataGrid Header [DATE] - Click', async () =>  {
                await fonction.clickElement(pageEmballage.tdNumCommande.nth(0));
            })

            test('Row [NUMERO DE COMMANDE][0] - Click', async () =>  {
                sNumCommande = await pageEmballage.tdNumCommande.nth(0).textContent();  // Cette fonction semble faire implicitement un click !!!
                log.set('Annulation de la commande : ' + sNumCommande);
            })

            test('Td [STATUT] = "Créé" - Check', async () => {
                var sStatutInitTexte = await pageEmballage.tdStatut.nth(0).textContent();
                sStatutInitTexte     = sStatutInitTexte.trim();
                log.set('Statut initial de la commande : ' + sStatutInitTexte);
                expect(sStatutInitTexte).toBe('Créé');
            })

            test('Button [ANNULER UN BL] - Click', async () =>  {
                await fonction.clickAndWait(pageEmballage.buttonAnnulerBl, page);
            })

            var sNomPopin = "Annulation d'un bon de restitution";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () =>  {

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible -Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })   

                test('Button [ANNULER UN BL] - Click', async () =>  {
                    await fonction.clickElement(pageEmballage.pPbuttonConfirmerAnnulation);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is NOT Visible -Check', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                }) 
            })

            test('Td [STATUT] = "Annulé" - Check', async () => {
                var sStatutFinalTexte = await pageEmballage.tdStatut.nth(0).textContent();
                sStatutFinalTexte     = sStatutFinalTexte.trim();
                log.set('Statut final de la commande : ' + sStatutFinalTexte);
                expect(sStatutFinalTexte).toBe('Annulé');
            })     
        })  //-- End Describe Onglet  

    })  //-- End Describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})