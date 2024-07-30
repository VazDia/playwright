/**
 * 
 * @author JC CALVIERA
 * @since 2024-01-26
 * 
 */

const xRefTest      = "PRE_PRE_SUP";
const xDescription  = "Supprimer un préparateur";
const xIdTest       =  2027;
const xVersion      = '3.2';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRE',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['A exécuter après le Test PRE_PRE_MOD'],
    params      : ['plateforme'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page, expect }      from '@playwright/test';

import { Help }                         from '@helpers/helpers.js';
import { TestFunctions }                from '@helpers/functions.js';
import { Log }                          from '@helpers/log.js';

import { MenuPreparation }              from '@pom/PRE/menu.page.js';
import { ProdGestionPreparateursPage }  from '@pom/PRE/productivite-gestion_preparateurs.page';

import { CartoucheInfo }                from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuPreparation;
let pageGestion         : ProdGestionPreparateursPage;

//------------------------------------------------------------------------------------

const sPlateforme       = process.env.PLATEFORME || 'Chaponnay';

const log               = new Log();
const fonction          = new TestFunctions(log);

const sNomParam         = fonction.getLocalConfig('nomPreparateur');
const sNom              = sNomParam;

//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page        = await browser.newPage();
    menu        = new MenuPreparation(page, fonction);
    pageGestion = new ProdGestionPreparateursPage(page);
    const helper= new Help(info, testInfo, page);
    await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
});

//------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']' , () => {
    
    test('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [PRODUCTIVITE]', async () => {   
        
        var iNbResponses = 0;

        var sNomPage = 'productivite';
        test ('Page [PRODUCTIVITE] - Click', async () => {
            await menu.click(sNomPage, page);
        }); 
        
        test('Message [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);
        }) 

        test('ListBox [PLATEFORME] = "' + sPlateforme + '"', async () => {            
            await menu.selectPlateforme(sPlateforme, page);                     // Sélection d'une plateforme 
            log.set('Plateforme : ' + sPlateforme);
        });

        test.describe('Onglet [GESTION PREPARATEUR]', async () => {   

            var sNomOnglet = 'Gestion préparateur'
            test('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(sNomPage,'gestionPreparateurs', page);         
            });

            test('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            }) 
            
            test('Input [NOM PREPARATEUR] = "TEST-AUTO_Nom"', async () => {
                await fonction.sendKeys(pageGestion.inputSearchPreparateur, sNom);
                await fonction.wait(page, 500);         // On attend que le liste se raffraîchisse
            });
    
            test('CheckBox [PREPARATEUR][0] - Click', async () => { 
                await fonction.clickElement(pageGestion.checkBoxListePreparateurs.nth(0));
                iNbResponses = await pageGestion.checkBoxListePreparateurs.count();
                log.set('Nombre de réponses filtrées AVANT suppression : ' + iNbResponses);
            });

            var sNomPopin = 'SUPPRESSION DU PREPARATEUR';
            test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                test('Button [SUPPRIMER UN PREPARATEUR]- Click', async () => {
                    await fonction.clickAndWait(pageGestion.buttonPreparateurDelete, page);
                }); 
                
                test('Button [CONFIRMER]- Click', async () => {
                    await fonction.clickAndWait(pageGestion.pPbuttonSupPreConfirmer, page);
                });                 

            }); //-- End Popin

            test('Input [NOM PREPARATEUR]#2 = "TEST-AUTO_Nom"', async () => {
                await fonction.sendKeys(pageGestion.inputSearchPreparateur, sNom);
                var iNbResponsesNow = await pageGestion.checkBoxListePreparateurs.count();
                log.set('Nombre de réponses filtrées APRES suppression : ' + iNbResponsesNow);
                expect(await pageGestion.checkBoxListePreparateurs.count()).toBeLessThan(iNbResponses);
            });          

        }); //-- End Describe Onglet  

    }); //-- End Describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

});   