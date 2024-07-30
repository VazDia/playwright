/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 25- 04 - 2024
 */

const xRefTest      = "MAG_STK_INV";
const xDescription  = "Réalisation d'un inventaire";
const xIdTest       =  79;
const xVersion      = '3.0';

var info = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['ville', 'groupeArticle' ],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { expect, test, type Page}        from '@playwright/test';

import { TestFunctions }                 from '@helpers/functions';
import { Log }                           from '@helpers/log';
import { Help }                          from '@helpers/helpers';

import { Credential }                    from '@conf/environnements/credential.conf.js';

//-- PageObject ----------------------------------------------------------------------

import { MenuMagasin }                   from '@pom/MAG/menu.page';
import { StockStock }                    from '@pom/MAG/stock-stock.page';
import { Authentificationpage }          from '@pom/COMMUN/authentification.page.js';

//-------------------------------------------------------------------------------------

const varianteLieuVente = require('../../conf/lieu_vente.conf.json');

//-------------------------------------------------------------------------------------

let page            : Page;

let menu            : MenuMagasin;
let pageStockStock  : StockStock;
let pageObjectAuth  : Authentificationpage;

const log           = new Log();
const fonction      = new TestFunctions(log);

//----------------------------------------------------------------------------------------


// Exploitation des paramètres passés en argument OU ceux présents dans le fichier de configuration Local
var villeCible      = fonction.getInitParam('ville', 'Sens');
var groupeArticle   = fonction.getInitParam('groupeArticle', 'Fruits et légumes');


var pageCourante    = 0;
var ladate          = new Date()
var jour:any        = fonction.addZero(ladate.getDate());
                   

var mois:any        = fonction.addZero(ladate.getMonth() + 1);
var annee           = ladate.getFullYear();
var messageAttendu  = 'Dernier inventaire du ' + jour + ' / ' + mois + ' / ' + annee + ' validé le ' + jour + ' / ' + mois + ' / ' + annee + ' à ';
var dateMvtAttendue = jour + ' / ' + mois + ' / ' + annee;

const sProfilAdmin  = 'lunettes';  // profil administtrateur
const sProfilRR     = 'veste';  // profil responsable de rayon

var bAlreadyExists  = false;

//---------------------------------------------------------------------------------------------

var checkCurrentPage = async (pageCourante:any) => {
        
    log.set('Traitement Page ' + (Number.parseInt(pageCourante) + 1));

    var articles            = [];
    articles[pageCourante]  = page.locator('.paginator > table > tbody > tr');
    await articles[pageCourante].last().waitFor({state:'visible'});
    var iNbArticles         = await articles[pageCourante].count();
    var aLastQuantity       = await articles[pageCourante].locator('.datagrid-derniereQuantiteComptee > span').allTextContents();
    var aLastQuantityKg     = await articles[pageCourante].locator('td.datagrid-derniereQuantiteUdComptee > span').allTextContents();
    for( let iIndexArticle   = 0; iIndexArticle < iNbArticles; iIndexArticle ++){

        await articles[pageCourante].nth(iIndexArticle).waitFor({state:'visible'});

        var sLastQuantity           = aLastQuantity[iIndexArticle];
        var inputQteCmPtee          = articles[pageCourante].nth(iIndexArticle).locator('.datagrid-quantiteComptee > input');
        var inputQteUdCmptes        = articles[pageCourante].nth(iIndexArticle).locator('.datagrid-quantiteUdComptee > input');
        var isVisibleInptQtCmptee   = await inputQteCmPtee.isVisible();
        var isVisbleInptQteUdCptes  = await inputQteUdCmptes.isVisible();
        // Le champ Input est présent, on le rempli avec la dernière valeur comptée
        if (isVisibleInptQtCmptee) {
            
            if (sLastQuantity == '') {                                               // Dans la cas ou l'article est nouveau et n'a jamais été inventorié

                sLastQuantity = '1';
            } else {

                sLastQuantity = sLastQuantity.replace(' ', '');                       // Si écriture séparteur de milliers = espace (Ex 1 048 => 1048)
            }
                                    
            await fonction.sendKeys(inputQteCmPtee, sLastQuantity);
            await fonction.wait(page, 500);                                                     // temporisation légère pour éviter les blocages 
        }  

        // Le deuxième champ Input est présent, on le rempli avec la dernière valeur comptée                                    
        if (isVisbleInptQteUdCptes) {                                              

            var sLastQuantityKg = aLastQuantityKg[iIndexArticle];

            if (sLastQuantityKg == '') {                                     // Dans la cas ou l'article est nouveau et n'a jamais été inventorié

                var lastQuantityGr  = 1;                                     // 1 Gr moini car on ne peut pas avoir un colis de 0 Gr...
            } else {

                var aBouts = sLastQuantityKg.match(/\d+/g);
                var lastQuantityGr = aBouts[0] * 1000;
                if (aBouts[1] != undefined) {

                    var dValeur = parseFloat(aBouts[0] + '.' + aBouts[1])
                    lastQuantityGr =  dValeur * 1000;
                }
            }
            await fonction.sendKeys(inputQteUdCmptes, lastQuantityGr.toString());
            await fonction.wait(page, 500);                                                    // temporisation légère pour éviter les blocages   
        }
    }

    var pagination               =  page.locator('.pagination-centered > ul > li');
    var paginationClass          = await pagination.last().getAttribute('class');
    

    if (paginationClass === 'disabled') {

        log.set('Fin traitement......................'); 
        await fonction.clickAndWait(pageStockStock.buttonEnregistrerInventaire, page);

        var lastInputQtCmptee      = await articles[pageCourante].last().locator('.datagrid-quantiteComptee > input');
        var lastInputQtCmpteeValue = await articles[pageCourante].last().locator('.datagrid-quantiteComptee > input').inputValue();
        if(lastInputQtCmpteeValue === ''){  // Il arrive souvent que la première valeur saisie dans le dernier champ ne soit pas prise en compte. D'où cette condition.

            await lastInputQtCmptee.pressSequentially(sLastQuantity, {delay:500}); // Cette fois la siasie sera faite de façon sequentielle.
            await fonction.wait(page, 500);
        }
    } else {

        await fonction.clickAndWait(pagination.locator('a').last(), page);            
        pageCourante++;        
        await checkCurrentPage(pageCourante);
    }
}
//---------------------------------------------------------------------------------------------

if (groupeArticle === undefined) {
    throw new Error('Oops : Code Groupe Article [' + groupeArticle + '] Inconnu')
} 

//---------------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageStockStock  = new StockStock(page);
    pageObjectAuth  = new Authentificationpage(page);
    const helper = new Help(info, testInfo, page);
    await helper.init();
})
 
test.afterAll(async ({}, testInfo) => {
	await fonction.close(testInfo);
})

//-----------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

	test ('Ouverture URL : ' + fonction.getApplicationUrl(), async({ context }) => {
		await context.clearCookies();
		await fonction.openUrl(page);
	});

    test ('Connexion RR', async () =>{
        const userCredential    = new Credential(sProfilRR);
        var infoProfil          = userCredential.getData();
        await pageObjectAuth.setJUsername(sProfilRR);
        await pageObjectAuth.setJPassword(infoProfil.password);
        await pageObjectAuth.clickConnexionButton(page);
    }) // end describe

    test.describe ('Page [ACCUEIL]', async () => {

        test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
            if(isVisible){

                await menu.removeArlerteMessage();
            }else{
                
                log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                test.skip();
            }
        })
    })

    test.describe ('Page [STOCK] - Traitement 1', async () => {

        var pageName    = 'stock';

        test ('Page [STOCK] - Click', async () => {
            await menu.click(pageName, page);
        })

        test ('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })  

        test ('ListBox [VILLE] = "' + villeCible + '"', async () => {
            await menu.selectVille(villeCible, page);
        })   
        
        test.describe ('Onglet [STOCK]', async () => {        

            test ('Onglet [STOCK] - Click', async () => {
                await menu.clickOnglet(pageName, 'stock',page);
            }) 

            test ('GROUPE ARTICLE', async () => {
                await fonction.listBoxByLabel(pageStockStock.listBoxGroupeArticle, groupeArticle, page);
            })

            test ('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de l'onglet
                await fonction.isErrorDisplayed(false, page);
            })          

            
            test ('Button [ANNULER INVENTAIRE] - Click (if Enabled)',  async () => {    //Si un inventaire est déjà en cours, on l'annule
                var enable = await pageStockStock.buttonAnnulerInventaire.isEnabled();
                if (enable) {
                    
                    await fonction.clickAndWait(pageStockStock.buttonAnnulerInventaire, page);
                }

                var present = await pageStockStock.pPbuttonOk.isVisible()
                if (present) {

                    await fonction.clickAndWait(pageStockStock.pPbuttonOk, page);
                }
            })

            var sNomPopin = "DEMARRAGE INVENTAIRE";
            test.describe ('Popin [' + sNomPopin.toUpperCase() + ']', async () => {  

                test ('Button [DEMARRER INVENTAIRE] - Click',  async () => {
                    await fonction.clickAndWait(pageStockStock.buttonDemarrerInventaire, page); 
                })

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                test ('DatePicker [DATE INVENTAIRE] = "Today"', async () => {
                    await fonction.clickElement(pageStockStock.popinDatePicker);
                    await fonction.clickElement(pageStockStock.popinDatePickerToday);
                })

                test ('Button [DEMARRER] - Click',  async () => {

                    await fonction.clickAndWait(pageStockStock.popinButtonDemarrer, page);
                    await fonction.wait(page, 5000);

                    // ??? - [6161] Impossible de créer un inventaire pour le ... car il existe déjà un inventaire de type comptable (Boucherie) à la date du ...
                    var alertIsVisible = await pageStockStock.messageErreur.isVisible();
                    if(alertIsVisible){

                        var sMessageErreur = await pageStockStock.messageErreur.textContent();
                        log.set('Message : ' + sMessageErreur);
                        bAlreadyExists = true;
                        await fonction.clickAndWait(pageStockStock.popinLinkAnnuler, page);
                        await fonction.wait(page, 2000);
                    }else{

                        // NOP
                    }
                })

                test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })
            })

            test ('** CHECK SAISIE INCOMPLETE [0] = message [6115]**', async () => {   // Check : on ne renseigne que le 1er article

                if (bAlreadyExists === false ) {

                    var lastQuantity = await pageStockStock.tdDernQuantiteComptee.nth(0).textContent();
                    var present      = await pageStockStock.inputQuantiteComptee.nth(0).isVisible();

                    // Le champ Input est présent, on le rempli avec la dernière valeur comptée
                    if (present) {

                        if (lastQuantity == '') {                   // Dans la cas ou l'article est nouveau et n'a jamais été inventorié
                            lastQuantity = '1';
                        }                        
                        await fonction.sendKeys(pageStockStock.inputQuantiteComptee.nth(0), lastQuantity);
                        await fonction.wait(page, 500);                                                    // temporisation légère pour éviter les blocages 
                    }  

                    await fonction.clickAndWait(pageStockStock.buttonValiderInventaire, page);

                    var error= await pageStockStock.ErrorMessage.textContent()
                    expect(error.slice(0,6)).toBe('[6115]');
                }
            })

            test ('** LANCEMENT TRAITEMENT **', async () => {
                test.setTimeout(600000);
                if (bAlreadyExists === false ) {
                    await checkCurrentPage(pageCourante);
                }
            })

            test ('Button [VALIDER INVENTAIRE] - Click', async () => {
                if (bAlreadyExists === false ) {

                    await fonction.clickAndWait(pageStockStock.buttonValiderInventaire, page);
                }
            })
            
            test ('Label [ERREUR 2] - Is Not Visible', async () => { 
                await fonction.isErrorDisplayed(false, page);
            }) 

            test ('Label [MESSAGE CONFIRMATION] contient "' + messageAttendu + '"', async () => {
                if (bAlreadyExists === false ) {

                    var messageReçu = await pageStockStock.messageConfirmation.textContent();
                    messageReçu     = messageReçu.trim();
                    expect(messageReçu).toContain(messageAttendu);
                }
            })
        })
    })

    test ('Déconnexion RR', async () => {
		await fonction.deconnexion(page);
	})

    test ('Connexion Admin', async () => {
        const userCredential    = new Credential(sProfilAdmin);
        var infoProfil          = userCredential.getData();
        await pageObjectAuth.setJUsername(sProfilAdmin);
        await pageObjectAuth.setJPassword(infoProfil.password);
        await pageObjectAuth.clickConnexionButton(page);
    }) 

    test.describe ('Page [STOCK] - Traitement 2', async () =>  {
        
        test ('Link [BROWSER SECURITY WARNING] - Click', async () => {
            await fonction.waitTillHTMLRendered(page);
            var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
            if(isVisible){

                await menu.removeArlerteMessage();
            }else{
                
                log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
                test.skip();
            }
        })
        

        var pageName    = 'stock';

        test ('Page [STOCK] - Click', async () => {
            await menu.click(pageName, page);
        })

        test ('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })  

        villeCible      = villeCible.replace(' (Fresh)', '');
        var villeCible2 = varianteLieuVente[villeCible];
        test ('ListBox [VILLE] = "' + villeCible2 + '"', async () => {
            await menu.selectVille(villeCible2, page);
        })

        test.describe ('Onglet [STOCK]', async () =>  {        

            test ('Onglet [STOCK] - Click', async () => {
                await menu.clickOnglet(pageName, 'stock',page);
            }) 

            test ('GROUPE ARTICLE', async () => {
                await fonction.listBoxByLabel(pageStockStock.listBoxGroupeArticle, groupeArticle, page);
            })

            test ('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de l'onglet  
                await fonction.isErrorDisplayed(false, page);
            })                                  

            if (groupeArticle != 'Fruits et légumes') {          // Le bouton n'est pas présent pour le FL

                test ('CheckBox [ARTICLES][0] - Click', async () =>  {
                    await pageStockStock.checkBoxListeArticles.nth(0).click();
                })

                test ('Button [MOUVEMENTS DE STOCK] - Click', async () =>  {
                    await fonction.clickAndWait(pageStockStock.buttonMouvementStock, page);
                })

                var sNomPopin    = 'VISUALISATION DES MOUVEMENTS DE STOCK';

                test.describe ('Popin [' + sNomPopin + ']', async () =>  {

                    test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                        await fonction.popinVisible(page, sNomPopin, true);
                    })

                    test ('Td [NATURE][Last] = "Inventaire comptable"', async () =>  {
                        if (bAlreadyExists === false ) {

                            // Alerte Sélecteur Môche !!! - Récup dernière ligne du tableau et la 7ème colonne...
                            var sMessageReçu = await pageStockStock.pPtrNatureMvt.last().locator('td').nth(6).textContent();
                            sMessageReçu = sMessageReçu.trim();
                            expect(sMessageReçu).toBe('Inventaire comptable');
                        }
                    })

                    test ('Td [DATE][Last] = '+ dateMvtAttendue, async () =>  {
                        if (bAlreadyExists === false ) {

                            var dateMvt = await pageStockStock.pPtrNatureMvt.last().locator('td').nth(0).textContent();
                            expect(dateMvt.slice(0,14)).toBe(dateMvtAttendue);

                        }
                    })

                    test ('Link [FERMER] - Click', async () =>  {
                        await fonction.clickAndWait(pageStockStock.pPlinkFermer, page);
                    })                

                    test ('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                        await fonction.popinVisible(page, sNomPopin, false);
                    })
                })
            }
        })
    })

    test ('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})

