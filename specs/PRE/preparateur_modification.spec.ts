/**
 * 
 * @author JC CALVIERA
 * @since 2024-01-26
 * 
 */

const xRefTest      = "PRE_PRE_MOD";
const xDescription  = "Modifier un préparateur";
const xIdTest       =  2026;
const xVersion      = '3.1';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRE',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : ['A exécuter après le Test PRE_PRE_CRE'],
    params      : ['plateformeOrigine','plateforme'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page }              from '@playwright/test';

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

const sPlateformeOrigine= process.env.PLATEFORMEORIGINE || 'Chaponnay';
const sPlateforme       = process.env.PLATEFORME || 'Cremlog';

const log               = new Log();
const fonction          = new TestFunctions(log);

const sNomParam         = fonction.getLocalConfig('nomPreparateur');
const sNom              = sNomParam.toUpperCase();
const sPrenom           = 'TEST-AUTO_Prenom_Modifié' + fonction.getToday();

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
        
        var sNomPage = 'productivite';
        test ('Page [PRODUCTIVITE] - Click', async () => {
            await menu.click(sNomPage, page);
        }); 
        
        test('Message [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);
        }) 

        test('ListBox [PLATEFORME] = "' + sPlateformeOrigine + '"', async () => {            
            await menu.selectPlateforme(sPlateformeOrigine, page);                     // Sélection d'une plateforme 
            log.set('Plateforme : ' + sPlateformeOrigine);
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
            });

            var sNomPopin = 'MODIFIER UN PREPARATEUR';
            test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () => {

                test('Button [MODIFIER UN PREPARATEUR]- Click', async () => {
                    await fonction.clickAndWait(pageGestion.buttonPreparateurUpdate, page);
                });            

                test('Input [NOM] = "'+  sNom + '"', async () => {
                    await fonction.sendKeys(pageGestion.pPinputCrePreNom, sNom);
                });                

                test('Input [PRENOM] = "'+  sPrenom + '"', async () => {
                    await fonction.sendKeys(pageGestion.pPinputCrePrePrenom, sPrenom);
                });                

                test('ListBox [EQUIPE][rnd] - Select', async () => { 
                    var iNbChoix = await pageGestion.pPlistBoxCrePreEquipe.locator('option').count();
                    var iRnd = Math.floor(fonction.random() * (iNbChoix - 1) + 1);
                    var sChoix = await pageGestion.pPlistBoxCrePreEquipe.locator('option').nth(iRnd).textContent();
                    log.set('Equipe : ' + sChoix);
                    await pageGestion.pPlistBoxCrePreEquipe.selectOption(sChoix);
                });

                test('ListBox [STATUT][rnd] - Select', async () => { 
                    var iNbChoix = await pageGestion.pPlistBoxCrePreStatut.locator('option').count();
                    var iRnd = Math.floor(fonction.random() * (iNbChoix - 1) + 1);
                    var sChoix = await pageGestion.pPlistBoxCrePreStatut.locator('option').nth(iRnd).textContent();
                    log.set('Equipe : ' + sChoix);
                    pageGestion.pPlistBoxCrePreStatut.selectOption(sChoix);
                });
                
                test('DatePeacker [DATE ENTREE] = "last day of month"', async () => {
                    await fonction.clickElement(pageGestion.pPdatepickerCrePreEntree);
                    await fonction.clickElement(pageGestion.pPcalendarCrePre.last());
                });   

                test('Toggle Button [ACTIF][rnd] - Click', async () => {
                    await fonction.clickToggleButton(pageGestion.pPcheckBoxCrePreActif, 0.5);
                });

                test('Toggle Button [PREPARATEUR EN VOCAL][rnd] - Click', async () => {
                    await fonction.clickToggleButton(pageGestion.pPcheckBoxCrePrePrepaVocal, 0.5);
                });

                test('Toggle Button [RESPONSABLE][rnd] - Click', async () => {
                    await fonction.clickToggleButton(pageGestion.pPcheckBoxCrePreResponsable, 0.5);
                });

                test('Toggle Button [RECEPTIONNAIRE][rnd] - Click', async () => {
                    await fonction.clickToggleButton(pageGestion.pPcheckBoxCrePreReception, 0.5);
                });

                test('Toggle Button [TEMPS PARTIEL][rnd] - Click', async () => {
                    await fonction.clickToggleButton(pageGestion.pPcheckBoxCrePreTpsPartiel, 0.5);
                });

                test('Toggle Button [CHARGEUR][rnd] - Click', async () => {
                    await fonction.clickToggleButton(pageGestion.pPcheckBoxCrePreChargeur, 0.5);
                });

                test('Toggle Button [MAGASINIER][rnd] - Click', async () => {
                    await fonction.clickToggleButton(pageGestion.pPcheckBoxCrePreMagasinier, 0.5);
                });

                test('CheckBox [PLATEFORME][rnd] - Select', async () => { 
                    var iNbChoix = await pageGestion.pPcheckBoxCrePreListPlatef.count();
                    // On essaye de cliquer sur un choix au hasard jusqu'à ce que le choix sélectionné soit différente de sPlateforme
                    do {
                        var iRnd = Math.floor(fonction.random() * (iNbChoix - 1) + 1);
                        var sChoix = await pageGestion.pPcheckBoxCrePreListPlatef.nth(iRnd).textContent();
                    } while (sChoix == sPlateforme);
                    log.set('Plateforme (rnd) : ' + sChoix);
                    await fonction.clickElement(pageGestion.pPcheckBoxCrePreListPlatef.nth(iRnd));
                });

                test('CheckBox [PLATEFORME] = "' + sPlateforme + '" - Click', async () => { 
                    await page.locator('p-checkbox label:text-is("' + sPlateforme + '")').click();
                    log.set('Plateforme (2) : ' + sPlateforme);
                })  

                test('Button [MODIFIER]- Click', async () => {
                    await fonction.clickElement(pageGestion.pPbuttonModPreModifier);
                });                  

            })

        }); //-- End Describe Onglet  

    }); //-- End Describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

});   